// Proto type stubs - will be augmented by generated buf files
export interface Message {
  toJSON(): Record<string, any>
}

export interface Service {
  [method: string]: (request: Message) => Promise<Message>
}
