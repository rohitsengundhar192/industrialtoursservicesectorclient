import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  @Input() videoSource: any;
  @Input() posterSource: any;
  @Input() isVideoLoaded: boolean = false;
  @Input() isShowControls: boolean = false;
  @Input() isMuted: boolean = false;
  @Input() isAutoPlay: boolean = false;
  @Input() changeCurrentTimeStamp: number = 0;

  @Output() timeUpdate = new EventEmitter();
  @Output() pickTimeStamp = new EventEmitter();
  @Output() thumbNailImage = new EventEmitter();
  @Output() videoTotalDuration = new EventEmitter();

  public video!: HTMLVideoElement;
  public player!: VideoJsPlayer;
  options: VideoJsPlayerOptions = {};
  isJumpTimeStamp: boolean = false;
  source: string = 'http://media.w3.org/2010/05/sintel/trailer.mp4';
  poster: string =
    'https://www.ionos.com/digitalguide/fileadmin/DigitalGuide/Teaser/webm.jpg';

  constructor() {}

  ngAfterViewInit(): void {
    this.onVideoLoad(this.videoSource);
    // console.log(this.videoSource,'vid');

  }
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  onVideoLoad(source: string) {

    this.options = {
      aspectRatio: '16:9',
      controls: this.isShowControls,
      autoplay: this.isAutoPlay,
      muted: this.isMuted,
      html5: {
        hls: {
          overrideNative: true,
        },
      },
      sources: [{ src: source, type: 'video/mp4' }],
      poster: this.posterSource,
    };

    this.player = videojs(this.videoPlayer.nativeElement, this.options, () => {
      if (this.isAutoPlay) this.player.play();
      else this.player.pause();
    });

    this.isVideoLoaded = false;
  }

  onGetVideoTotalDuration(e: Event) {
    this.videoTotalDuration.emit(this.player.duration());
  }

  onTimeUpdate(e: Event) {
    this.timeUpdate.emit(e);
  }
  onPickTimeStamp(e: Event) {
    this.pickTimeStamp.emit(e);
    this.player.pause();
  }

  onGetThumbnail() {
    const dataURL = this.captureImage();
    this.thumbNailImage.emit(dataURL);
    this.player.pause();
  }

  captureImage() {
    let video = this.videoPlayer.nativeElement as HTMLVideoElement;
    const canvasElement = <HTMLCanvasElement>document.createElement('CANVAS');
    const context = canvasElement.getContext('2d');
    let w: number, h: number;
    w = video.videoWidth;
    h = video.videoHeight;
    canvasElement.width = w;
    canvasElement.height = h;
    // context.drawImage(video, 0, 0, w, h);
    const dataURL = canvasElement.toDataURL();
    return dataURL;
  }

  onTimeStampChangeToPlay() {
    this.isJumpTimeStamp = true;
    this.player.currentTime(this.changeCurrentTimeStamp);
    setTimeout(() => {
      this.player.play();
      this.player.setTimeout(() => {
        this.player.play();
        this.player.setTimeout(() => {
          this.player.pause();
        }, 1000 * 5);
      }, 300);
    }, 0);
  }
}
