import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const TextToPdfConverter = () => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setConvertedFiles([]);
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;
    
    setConverting(true);
    const newConvertedFiles = [];

    for (const file of files) {
      try {
        // Read the text file
        const text = await readFileAsText(file);
        
        // Create PDF
        const pdf = new jsPDF();
        
        // Split text into lines to fit on the page
        const textLines = pdf.splitTextToSize(text, 180);
        
        // Add text to PDF
        pdf.setFontSize(12);
        
        // Handle multiple pages if needed
        let y = 20;
        const lineHeight = 7;
        
        for (let i = 0; i < textLines.length; i++) {
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
          
          pdf.text(textLines[i], 15, y);
          y += lineHeight;
        }
        
        // Generate PDF as blob
        const pdfBlob = pdf.output('blob');
        
        // Create a URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        newConvertedFiles.push({
          name: `${file.name.split('.')[0]}.pdf`,
          url: pdfUrl
        });
      } catch (error) {
        console.error(`Error converting ${file.name}:`, error);
      }
    }
    
    setConvertedFiles(newConvertedFiles);
    setConverting(false);
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Text to PDF Converter</h1>
      
      <div className="mb-6">
        <label 
          htmlFor="fileInput" 
          className="block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          {files.length > 0 
            ? `${files.length} file(s) selected` 
            : 'Click to select text files'}
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".txt"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {files.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="text-sm">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      <button
        onClick={convertToPdf}
        disabled={files.length === 0 || converting}
        className={`w-full py-2 px-4 rounded-md ${
          files.length === 0 || converting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {converting ? 'Converting...' : 'Convert to PDF'}
      </button>
      
      {convertedFiles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Download PDFs:</h2>
          <ul className="space-y-2">
            {convertedFiles.map((file, index) => (
              <li key={index}>
                <a
                  href={file.url}
                  download={file.name}
                  className="block p-2 bg-green-100 rounded-md hover:bg-green-200 text-center text-green-800"
                >
                  Download {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TextToPdfConverter;