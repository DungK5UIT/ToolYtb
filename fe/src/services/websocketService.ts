export interface WebSocketMessage {
  type: 'DOWNLOAD_PROGRESS' | 'DOWNLOAD_COMPLETED' | 'DOWNLOAD_FAILED' | 'NEW_VIDEO' | 'CHANNEL_STATUS' | 'SYSTEM_ALERT';
  data: any;
  timestamp: string;
  messageId: string;
}

export interface DownloadProgressMessage {
  videoId: string;
  videoTitle: string;
  channelId: string;
  channelName: string;
  progress: number;
  downloadSpeed: string;
  estimatedTimeRemaining?: number;
  status: 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

export interface NewVideoMessage {
  videoId: string;
  videoTitle: string;
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  publishedAt: string;
  autoDownloadTriggered: boolean;
}

export interface SystemAlertMessage {
  level: 'INFO' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  action?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private listeners: { [key: string]: ((message: WebSocketMessage) => void)[] } = {};
  private isManualClose = false;


  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8082/ws';
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
          }
        };

        this.ws.onclose = (event) => {
          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect().catch(error => {
      });
    }, this.reconnectInterval * this.reconnectAttempts);
  }


  private handleMessage(message: WebSocketMessage): void {


    const typeListeners = this.listeners[message.type] || [];
    typeListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });


    const generalListeners = this.listeners['*'] || [];
    generalListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Error in general WebSocket listener:', error);
      }
    });
  }


  subscribe(messageType: string, callback: (message: WebSocketMessage) => void): () => void {
    if (!this.listeners[messageType]) {
      this.listeners[messageType] = [];
    }
    this.listeners[messageType].push(callback);


    return () => {
      const listeners = this.listeners[messageType];
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }


  subscribeToAll(callback: (message: WebSocketMessage) => void): () => void {
    return this.subscribe('*', callback);
  }


  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }


  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }




  onDownloadProgress(callback: (data: DownloadProgressMessage) => void): () => void {
    return this.subscribe('DOWNLOAD_PROGRESS', (message) => {
      callback(message.data as DownloadProgressMessage);
    });
  }


  onDownloadCompleted(callback: (data: DownloadProgressMessage) => void): () => void {
    return this.subscribe('DOWNLOAD_COMPLETED', (message) => {
      callback(message.data as DownloadProgressMessage);
    });
  }


  onNewVideo(callback: (data: NewVideoMessage) => void): () => void {
    return this.subscribe('NEW_VIDEO', (message) => {
      callback(message.data as NewVideoMessage);
    });
  }


  onSystemAlert(callback: (data: SystemAlertMessage) => void): () => void {
    return this.subscribe('SYSTEM_ALERT', (message) => {
      callback(message.data as SystemAlertMessage);
    });
  }


  watchVideo(videoId: string): void {
    this.send({
      type: 'WATCH_VIDEO',
      videoId: videoId,
      timestamp: new Date().toISOString()
    });
  }


  unwatchVideo(videoId: string): void {
    this.send({
      type: 'UNWATCH_VIDEO',
      videoId: videoId,
      timestamp: new Date().toISOString()
    });
  }


  watchChannel(channelId: string): void {
    this.send({
      type: 'WATCH_CHANNEL',
      channelId: channelId,
      timestamp: new Date().toISOString()
    });
  }


  unwatchChannel(channelId: string): void {
    this.send({
      type: 'UNWATCH_CHANNEL',
      channelId: channelId,
      timestamp: new Date().toISOString()
    });
  }




  private showNotification(title: string, body: string, icon?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/logo192.png',
        badge: '/logo192.png'
      });
    }
  }


  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }


  setupAutoNotifications(): void {

    this.onDownloadCompleted((data) => {
      this.showNotification(
        'Download Hoàn Thành',
        `Video "${data.videoTitle}" từ kênh ${data.channelName} đã tải xong!`
      );
    });


    this.subscribe('DOWNLOAD_FAILED', (message) => {
      const data = message.data as DownloadProgressMessage;
      this.showNotification(
        'Download Thất Bại',
        `Không thể tải video "${data.videoTitle}" từ kênh ${data.channelName}`
      );
    });


    this.onNewVideo((data) => {
      if (data.autoDownloadTriggered) {
        this.showNotification(
          'Video Mới & Tự Động Tải',
          `Video mới "${data.videoTitle}" từ kênh ${data.channelName} đã được tự động thêm vào hàng đợi tải!`
        );
      } else {
        this.showNotification(
          'Video Mới',
          `Kênh ${data.channelName} vừa đăng video mới: "${data.videoTitle}"`
        );
      }
    });


    this.onSystemAlert((data) => {
      if (data.level === 'ERROR') {
        this.showNotification(
          `${data.title}`,
          data.message
        );
      }
    });
  }




  disconnect(): void {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}


const websocketService = new WebSocketService();
export default websocketService;
