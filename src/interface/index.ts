export interface Point {
  x: number;
  y: number;
}

export interface IConnectProps {
  component;
  mapStateToProps?;
  mapDispatchToProps?;
}

interface IFileReaderEventTarget extends EventTarget {
  result: ArrayBuffer;
}

export interface IFileReaderEvent extends Event {
  currentTarget: IFileReaderEventTarget;
  getMessage(): string;
}
