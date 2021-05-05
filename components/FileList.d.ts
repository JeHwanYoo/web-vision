declare interface FileList {
  forEach: (
    callback: (f: File, i: number, list: FileList) => void,
    thisArg?: any,
  ) => undefined
}
