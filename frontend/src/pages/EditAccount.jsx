import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/accounts/${id}`);
        const data = await res.json();
        const conta = data.data;

        setName(conta.name);
        setValue(conta.value);
        setDueDate(conta.due_date?.slice(0, 10));
      } catch (err) {
        console.error('Erro ao carregar conta:', err);
        setMsg('Erro ao carregar dados da conta');
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

      // 🔒 Validação de valor
  if (!value || parseFloat(value) <= 0) {
    setMsg('Erro, o valor deve ser maior que zero.');
    return;
  }

  // 🔒 Validação de data
  const hoje = new Date();
  const dataVencimento = new Date(dueDate);

  if (!dueDate || dataVencimento < new Date(hoje.toDateString())) {
    setMsg('Erro, a data de vencimento deve ser hoje ou uma data futura.');
    return;
  }


    const dadosAtualizados = {
      name,
      value,
      due_date: dueDate,
    };

    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Conta atualizada com sucesso!');
        setTimeout(() => navigate(-1), 1000);
      } else {
        setMsg(data.message || 'Erro ao atualizar conta');
      }
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      setMsg('Erro ao atualizar conta');
    }
  };

  // 🔍 OCR A PARTIR DO PDF
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const { data: { text } } = await Tesseract.recognize(canvas, 'por');
        fullText += text + '\n';
      }

      preencherCamposComTexto(fullText);
    };

    reader.readAsArrayBuffer(file);
  };

  // 🔍 OCR A PARTIR DE IMAGEM
  const handleImagem = (file) => {
    if (!file) return;

    Tesseract.recognize(file, 'por', {
      logger: m => console.log(m)
    })
      .then(({ data: { text } }) => {
        preencherCamposComTexto(text);
      })
      .catch((err) => {
        console.error('Erro no OCR:', err);
        setMsg('Erro ao processar documento');
      });
  };

  // 🧠 Preenche os campos extraídos
  const preencherCamposComTexto = (text) => {
    const nomeMatch = text.match(/(fatura|conta|boleto|[^:\n]{4,})/i);
    const valorMatch = text.match(/R?\$?\s?(\d{1,4}[.,]?\d{2})/);
    const vencMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);

    if (nomeMatch) setName(nomeMatch[0]);
    if (valorMatch) setValue(valorMatch[1].replace(',', '.'));
    if (vencMatch) {
      const partes = vencMatch[1].split('/');
      setDueDate(`${partes[2]}-${partes[1]}-${partes[0]}`);
    }

    setMsg('Informações preenchidas automaticamente 🎉');
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
      <h2>Editar Conta</h2>
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

        <button type="submit" style={{ marginTop: '15px' }}>Salvar Alterações</button>
      </form>

      {msg && (
        <p className={`feedback-msg ${msg.toLowerCase().includes('erro') ? 'feedback-error' : 'feedback-success'}`}>
          {msg}
        </p>
      )}

    </div>
  );
}

export default EditAccount;
