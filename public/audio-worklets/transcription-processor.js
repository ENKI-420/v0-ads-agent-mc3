import { AudioWorkletProcessor, registerProcessor } from "audio-worklet"

class TranscriptionProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    this.bufferSize = options.processorOptions.bufferSize || 4096
    this.sampleRate = options.processorOptions.sampleRate || 48000
    this.buffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]

    if (input.length > 0) {
      const inputChannel = input[0]

      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i]
        this.bufferIndex++

        if (this.bufferIndex >= this.bufferSize) {
          // Send buffer to main thread for processing
          this.port.postMessage({
            audioData: this.buffer.slice(),
            timestamp: Date.now(),
          })

          // Reset buffer
          this.bufferIndex = 0
          this.buffer.fill(0)
        }
      }
    }

    return true
  }
}

registerProcessor("transcription-processor", TranscriptionProcessor)
