function initProtoNamespace() {
  if (!window.jspb || !window.jspb.Message) {
    setTimeout(initProtoNamespace, 10);
    return;
  }

  if (!window.proto) window.proto = {};
  if (!window.proto.google) window.proto.google = {};
  if (!window.proto.google.protobuf) window.proto.google.protobuf = {};
  if (!window.proto.google.rpc) window.proto.google.rpc = {};

  class Timestamp extends jspb.Message {
    constructor(opt_data) {
      super();
      this.seconds_ = opt_data?.seconds_ || 0;
      this.nanos_ = opt_data?.nanos_ || 0;
    }

    static deserializeBinary(bytes) {
      const msg = new Timestamp();
      Timestamp.deserializeBinaryFromReader(msg, new jspb.BinaryReader(bytes));
      return msg;
    }

    static deserializeBinaryFromReader(msg, reader) {
      while (reader.nextField()) {
        if (reader.isEndGroup()) break;
        const field = reader.getFieldNumber();
        switch (field) {
          case 1:
            msg.seconds_ = reader.readInt64();
            break;
          case 2:
            msg.nanos_ = reader.readInt32();
            break;
          default:
            reader.skipField();
            break;
        }
      }
      return msg;
    }

    static toObject(includeInstance, msg) {
      return msg ? msg.toObject(includeInstance) : { seconds: 0, nanos: 0 };
    }

    toObject(includeInstance) {
      return { seconds: this.seconds_, nanos: this.nanos_ };
    }

    serializeBinary() {
      const writer = new jspb.BinaryWriter();
      Timestamp.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    static serializeBinaryToWriter(message, writer) {
      if (message.seconds_) {
        writer.writeInt64(1, message.seconds_);
      }
      if (message.nanos_) {
        writer.writeInt32(2, message.nanos_);
      }
    }

    getSeconds() {
      return this.seconds_;
    }

    getNanos() {
      return this.nanos_;
    }
  }

  // Define FieldMask class
  class FieldMask extends jspb.Message {
    constructor(opt_data) {
      super();
      this.paths_ = opt_data?.paths_ || [];
    }

    static deserializeBinary(bytes) {
      const msg = new FieldMask();
      FieldMask.deserializeBinaryFromReader(msg, new jspb.BinaryReader(bytes));
      return msg;
    }

    static deserializeBinaryFromReader(msg, reader) {
      while (reader.nextField()) {
        if (reader.isEndGroup()) break;
        const field = reader.getFieldNumber();
        switch (field) {
          case 1:
            msg.paths_.push(reader.readString());
            break;
          default:
            reader.skipField();
            break;
        }
      }
      return msg;
    }

    static toObject(includeInstance, msg) {
      return msg ? msg.toObject(includeInstance) : { paths: [] };
    }

    toObject(includeInstance) {
      return { paths: this.paths_ };
    }

    serializeBinary() {
      const writer = new jspb.BinaryWriter();
      FieldMask.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    static serializeBinaryToWriter(message, writer) {
      message.paths_.forEach((path) => {
        writer.writeString(1, path);
      });
    }
  }

  proto.google.protobuf.Timestamp = Timestamp;
  proto.google.protobuf.FieldMask = FieldMask;

  const script = document.createElement("script");
  script.src = "assets/js/proto.js";
  document.head.appendChild(script);
}

initProtoNamespace();
