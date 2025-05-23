import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const ASSEMBLY_API_KEY = '79a425019e594fd08b87e2e1fffa8753';

export async function sendAudioToAssemblyAI(
  audioPath: string,
): Promise<string> {
  const audioData = fs.readFileSync(audioPath);

  //  Upload audio to AssemblyAI
  const uploadRes = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    audioData,
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        'content-type': 'application/octet-stream',
      },
    },
  );
  const audioUrl = uploadRes.data.upload_url;

  //  Request transcription
  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: audioUrl },
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        'content-type': 'application/json',
      },
    },
  );

  const transcriptId = transcriptRes.data.id;

  // Poll for result
  let transcriptText = '';
  while (true) {
    const polling = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: { authorization: ASSEMBLY_API_KEY },
      },
    );

    if (polling.data.status === 'completed') {
      transcriptText = polling.data.text;
      break;
    } else if (polling.data.status === 'error') {
      throw new Error('Transcription failed: ' + polling.data.error);
    }

    await new Promise((res) => setTimeout(res, 3000));
  }

  // Save transcript to file
  const transcriptFolder = path.join(__dirname, '..', '..', 'transcripts');
  if (!fs.existsSync(transcriptFolder)) {
    fs.mkdirSync(transcriptFolder);
  }

  const transcriptPath = path.join(
    transcriptFolder,
    `${path.basename(audioPath, path.extname(audioPath))}.txt`,
  );
  fs.writeFileSync(transcriptPath, transcriptText);

  return transcriptText;
}
