import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import './viewer.css';
import pdf from "../pdf/policies.pdf";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Navbar from "../Navbar/Navbar";

const Viewer = () => {
  const [totalPages, settotalPages] = useState(0);
  const [pageNumber, setpageNumber] = useState(1); 

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  /**
   * @param {Object} event
   * this function will be called when pdf is loaded
   */
  function onDocLoad(event) {
    console.log("Pdf loaded: ", event.numPages);
    settotalPages(event.numPages);
  }

  const changePage = (param) => {
    if (param === "prev") {
      setpageNumber((prev) => prev - 1);
    }

    if (param === "next") {
      setpageNumber((prev) => prev + 1);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdf;
    link.download = 'policies.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-slate-100 overflow-hidden">
      <Navbar />
      <div className="w-full flex-1 flex justify-start items-start overflow-hidden pt-[70px]">
        <div className="border-r border-slate-200 dark:border-neutral-900 px-3 w-60 p-2 h-full bg-slate-50 dark:bg-black flex flex-col">
          <div className="px-2 py-3 border-b border-slate-200 dark:border-neutral-900 text-center font-semibold text-lg text-slate-900 dark:text-slate-100">
            Pages
          </div>
          <div className="flex-1 overflow-y-auto pb-10">
            <Document
              className={"flex flex-col justify-start items-center overflow-auto h-full"}
              file={pdf}
              onLoadSuccess={onDocLoad}
            >
              {
                Array(totalPages)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setpageNumber(index + 1);
                      }}
                      className={`border-[4px] cursor-pointer relative rounded my-2 transition ${
                        pageNumber === index + 1 ? "border-slate-800 dark:border-white" : "border-transparent"
                      }`}
                    >
                      <Page
                        height={180}
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      ></Page>
                    </div>
                  ))
              }
            </Document>
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col">
          <div className="w-full bg-slate-100 dark:bg-black h-full flex flex-col">
            <div className="bg-white dark:bg-neutral-950 h-16 py-2 px-6 flex justify-between items-center border-b border-slate-200 dark:border-neutral-900">
              <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">Policies PDF</div>
              <div className="flex justify-center items-center gap-3">
                <IoIosArrowBack
                  className="cursor-pointer text-xl hover:text-slate-500 transition text-slate-900 dark:text-slate-100"
                  onClick={() => pageNumber > 1 && changePage("prev")}
                />
                <div className="px-3 py-1 rounded font-medium text-slate-900 dark:text-slate-100">
                  {pageNumber} <span className="opacity-50">of</span> {totalPages}
                </div>
                <IoIosArrowForward
                  className="cursor-pointer text-xl hover:text-slate-500 transition text-slate-900 dark:text-slate-100"
                  onClick={() => pageNumber < totalPages && changePage("next")}
                />
              </div>
              <div>
                <button 
                  className="bg-black dark:bg-white text-white dark:text-black font-semibold px-6 cursor-pointer py-2 rounded-lg hover:opacity-90 transition border border-transparent dark:border-neutral-800" 
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-neutral-900 p-6 flex-1 overflow-auto flex justify-center items-start">
              <div className="shadow-lg border border-slate-200 dark:border-neutral-900 rounded bg-white p-2">
                <Document file={pdf}>
                  <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  ></Page>
                </Document>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
