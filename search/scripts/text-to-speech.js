function playTextToSpeech(text) {
    texto_limpio = ""
    // if text has /, split and take last part
    if (text.includes('/')) {
        texto_limpio = text.split('/').slice(-1)[0].trim();
    } else {
        texto_limpio = text.trim();
    }
    console.log('playTextToSpeech called with text:', texto_limpio);

    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported in this browser.');
        return;
    }

    const synth = window.speechSynthesis;

    // Stop any currently playing speech
    if (synth.speaking) {
        console.log('Stopping currently playing speech...');
        synth.cancel();
    }

    const voices = synth.getVoices();

    if (voices.length === 0) {
        console.warn('No voices available. Ensure voices are loaded during initialization.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(texto_limpio);
    utterance.lang = 'zh-CN'; // Set language to Chinese
    utterance.voice = voices.find(voice => voice.lang === 'zh-CN') || null;

    if (!utterance.voice) {
        console.warn('No Chinese voice found. Using default voice.');
    } else {
        console.log('Using voice:', utterance.voice);
    }

    if (!synth.speaking) {
        synth.speak(utterance);
    } else {
        console.log('Speech synthesis is already in progress.');
    }
    console.log('Speech synthesis started.');
}