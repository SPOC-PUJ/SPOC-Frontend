<script setup>
import {onMounted, ref} from 'vue';

const output = ref('');

const processFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const data = new Uint8Array(reader.result);

    Module.FS_createDataFile('/', 'filename', data, true, true, true);

    const edfInstance = new Module.EDF('filename');

    // Example of using the EDF instance
    edfInstance.PrintHeaderRecords();
    edfInstance.PrintDataRecords();
    edfInstance.PrintSizeSignals();
    edfInstance.PrintTopValues(5);

    console.log(edfInstance);

    const signalsInstance = edfInstance.Signals;

    console.log(signalsInstance);

    signalsInstance.CalculateMeans();
    signalsInstance.CalculateDeviation();
    signalsInstance.PrintMeanAndDeviation();

    var sigInstanc = signalsInstance.signals;

    console.log(sigInstanc);
    if (sigInstanc.size() !== 0) {
      console.log(sigInstanc.size());

      console.log('signals found.');
    }

    var veceigen = sigInstanc.get(0);
    console.log(veceigen);
    console.log(veceigen.size);
    // for (let i = 0; i < veceigen.size; i++) {
    //   var complexValue = veceigen.get(i);
    //   console.log('Complex value:', complexValue);
    //   console.log('Real part:', complexValue.real());
    //   console.log('Imaginary part:', complexValue.imag());
    // }

    output.value = 'File processed successfully';
    event.target.value = ''; // Clear the file input after processing
  };

  reader.readAsArrayBuffer(file); // Read as binary data
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'wasm/edf.js';
  script.onload = () => {
    console.log('WebAssembly module initialized');
  };
  document.body.appendChild(script);
});
</script>

<template>
  <div>
    <h1>EDF File Processor</h1>
    <input type="file" @change="processFile"/>
    <pre>{{ output }}</pre>
  </div>
</template>
