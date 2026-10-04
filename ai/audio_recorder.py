import sounddevice as sd
from scipy.io.wavfile import write


def record_audio(
    output_file="candidate_answer.wav",
    duration=10,
    sample_rate=44100
):

    print("Recording started...")
    print("Please speak now.")

    recording = sd.rec(
        int(duration * sample_rate),
        samplerate=sample_rate,
        channels=1
    )

    sd.wait()

    write(
        output_file,
        sample_rate,
        recording
    )

    print("Recording completed.")
    print("Audio file:", output_file)

    return output_file


if __name__ == "__main__":

    record_audio(
        output_file="candidate_answer.wav",
        duration=10
    )