export default class Speech {
  constructor(area, indicator, isEngLang) {
    this.area = area;
    this.indicator = indicator;
    this.recognition = null;
    this.isSpeech = false;

    this.init(isEngLang);
  }

  toggleState() {
    if (this.isSpeech) {
      this.isSpeech = false;
      this.recognition.stop();
      this.indicator.classList.remove('speech--indicator-on');
    } else {
      this.isSpeech = true;
      this.recognition.start();
      this.indicator.classList.add('speech--indicator-on');
    }
  }

  setHandlers() {
    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      // eslint-disable-next-line no-console
      console.log(transcript, this.recognition.lang);

      if (e.results[0].isFinal) {
        this.area.value = `${this.area.value}${transcript} `;
      }
    });

    this.recognition.addEventListener('end', () => {
      if (this.isSpeech) this.recognition.start();
    });
  }

  init(isEngLang) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new window.SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = isEngLang ? 'en' : 'ru';

    this.setHandlers();
  }
}
