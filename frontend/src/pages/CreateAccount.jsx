import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function CreateAccount() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novaConta = {
      name,
      value: parseFloat(value),
      due_date: dueDate,
      group_id: parseInt(groupId)
    };

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConta)
      });

      const data = await res.json();
      setMsg(data.message || 'Conta adicionada com sucesso!');

      if (res.status === 201) {
        setMsg(data.message || 'Conta adicionada com sucesso!');
        setTimeout(() => navigate(`/accounts/${data.accountId}/split`), 1000);
      }

    } catch (err) {
      console.error('❌ Erro ao criar conta:', err);
      setMsg('Erro ao criar conta');
    }
  };

  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const { data: { text } } = await Tesseract.recognize(canvas, 'por');
        fullText += '\n' + text;
      }

      console.log('📄 Texto completo extraído do PDF:', fullText);
      preencherCamposComTexto(fullText);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleImagem = (file) => {
    if (!file) return;

    Tesseract.recognize(file, 'por', {
      logger: m => console.log(m)
    })
      .then(({ data: { text } }) => {
        console.log('🖼️ Texto extraído da imagem:', text);
        preencherCamposComTexto(text);
      })
      .catch(err => {
        console.error('❌ Erro no OCR:', err);
        setMsg('Erro ao processar imagem');
      });
  };

  const preencherCamposComTexto = (text) => {
    const linhas = text.split('\n').map(l => l.trim()).filter(Boolean);

    let nomeDetectado = '';
    let valorDetectado = '';
    let vencDetectado = '';

    for (const linha of linhas) {
      const lower = linha.toLowerCase();

      // Nome
      if (!nomeDetectado && /(fatura|conta|água|internet|telefone|luz|boleto|net|tim|vivo|claro)/i.test(linha)) {
        nomeDetectado = linha;
      }

      // Valor (linha com 'total', 'valor' ou com R$ + número)
      if (!valorDetectado && /r?\$|valor|total/i.test(lower)) {
        const match = linha.match(/(\d{1,4}[.,]?\d{2})/);
        if (match) valorDetectado = match[1].replace(',', '.');
      }

      // Vencimento
      if (!vencDetectado && /venc|vencimento/i.test(lower)) {
        const match = linha.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (match) {
          const [dia, mes, ano] = match[1].split('/');
          vencDetectado = `${ano}-${mes}-${dia}`;
        }
      }

      if (nomeDetectado && valorDetectado && vencDetectado) break;
    }

    if (nomeDetectado) setName(nomeDetectado);
    if (valorDetectado) setValue(valorDetectado);
    if (vencDetectado) setDueDate(vencDetectado);

    if (nomeDetectado || valorDetectado || vencDetectado) {
      setMsg('Informações preenchidas automaticamente 🎉');
    } else {
      setMsg('Não foi possível identificar os dados automaticamente');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      extractTextFromPDF(file);
    } else {
      handleImagem(file);
    }
  };

  return (
    <div className="create-group-container">
      <h2>Nova Conta</h2>
      <form onSubmit={handleSubmit} className="create-group-form">
        <input
          type="text"
          placeholder="Nome da conta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div>
          <p><strong>Ou envie uma imagem ou PDF:</strong></p>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>Salvar Conta</button>
        
      </form>
      <p>{msg}</p>
    </div>
  );
  
}

export default CreateAccount;
