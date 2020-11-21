import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() acceptedFileTypes!: string;

  /**
   * Emits the file that was selected
   * @type {EventEmitter<File | null>}
   * @memberof FileUploadComponent
   */
  @Output() public fileSelected!: EventEmitter<File | null>;

  public onChange!: Function;

  public file!: File | null;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);

    this.onChange(file);

    this.file = file;

    // emit the file
    this.fileSelected.emit(file);
  }

  constructor(private host: ElementRef<HTMLInputElement>) {
    this.file = null;

    // initialize event emitters
    this.fileSelected = new EventEmitter();
  }

  public writeValue() {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  public registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  public registerOnTouched() {}
}
