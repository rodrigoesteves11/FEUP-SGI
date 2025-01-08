class Timer {
    constructor() {
      this.lapTimes = [];
      this.startTime = null;
      this.currentLapStart = null;
      this.currentLapStart2 = null;
      this.bestLapTime = null;
      this.totalTime = 0;
      this.totalTime2 = 0;
      this.running = false;
    }
  
    start() {
      this.startTime = performance.now();
      this.currentLapStart = this.startTime;
      this.currentLapStart2 = this.startTime;
      this.running = true;
    }
  
    startNewLap() {
      const now = performance.now();
      if (this.currentLapStart !== null) {
        const lapTime = now - this.currentLapStart;
        this.lapTimes.push(lapTime);
        this.totalTime += lapTime;
  
        if (this.bestLapTime === null || lapTime < this.bestLapTime) {
          this.bestLapTime = lapTime;
        }
      }
      this.currentLapStart = now;
    }
  
    stop() {
      if (this.running) {
        const now = performance.now();
        if (this.currentLapStart !== null) {
          const lapTime = now - this.currentLapStart;
          this.lapTimes.push(lapTime);
          this.totalTime += lapTime;
  
          if (this.bestLapTime === null || lapTime < this.bestLapTime) {
            this.bestLapTime = lapTime;
          }
        }
        this.currentLapStart = null;
        this.running = false;
      }
    }
  
    reset() {
      this.lapTimes = [];
      this.startTime = null;
      this.currentLapStart = null;
      this.currentLapStart2 = null;
      this.bestLapTime = null;
      this.totalTime = 0;
      this.totalTime2 = 0;
      this.running = false;
    }
  
    update() {
      if (this.running && this.currentLapStart2 !== null) {
        const now = performance.now();
        this.totalTime2 += now - this.currentLapStart2;
        this.currentLapStart2 = now;
      }
    }
  
    getLapTimes() {
      return this.lapTimes;
    }
  
    getBestLapTime() {
      return this.bestLapTime;
    }

    getTotalTime() {
        return this.totalTime;
    }
  
    getTotalTime2() {
      return this.totalTime2;
    }
  
    formatTime(milliseconds) {
      if (milliseconds === null || milliseconds === undefined) {
        return "N/A"; 
      }
  
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      const ms = Math.floor(milliseconds % 1000);
  
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
    }
  }
  
  export default Timer;
  