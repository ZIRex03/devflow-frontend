import { uploadUserBanner } from "@/features/slice/user/userSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import React, { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

type Props = {
  closeForm: () => void;
  userId: string
};

const BannerDownload = ({ closeForm, userId }: Props) => {
  const dispatch = useAppDispatch();
    const inputFile = useRef<HTMLInputElement | null>(null);
    const [isSend, setIsSend] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);
  
    const handleInputFile = () => {
      if (!inputFile.current) return;
  
      setIsSend(false);
  
      if (inputFile.current.files && inputFile.current.files.length > 0) {
        const file = inputFile.current.files[0];
        setSelectedFile(file);
  
        const filePreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(filePreviewUrl);
  
        setIsSend(true);
      } else {
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    };
  
    const handleSubmit = async () => {
      if (!selectedFile) return;
  
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("userbanner", selectedFile);
  
      try {
          await dispatch(uploadUserBanner(formData)).unwrap();
          setSelectedFile(null);
          setPreviewUrl(null);
          closeForm();
  
          setIsSend(false);
        
          if (inputFile.current) {
              inputFile.current.value = "";
          }
      } 
      catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Unknown error occurred");
        }
      }
      
      
    };
  
    const handleCancel = () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
      setIsSend(false);
      if (inputFile.current) {
        inputFile.current.value = "";
      }
    };

  return (
    <div className="downloadsbox">
      <div className="downloadsbox__header">
        <p>Загрузить обложку</p>
        <IoClose className="downloadsbox__header-close" onClick={closeForm} />
      </div>

      <div className="downloadsbox__main">
        <input
          ref={inputFile}
          className="downloadsbox__main-input"
          type="file"
          id="avatar-input"
          accept="image/*"
          onChange={handleInputFile}
        />

        {isSend ? (
          <div className="downloadsbox__main-send">
            <div className="downloadsbox__main-send-preview">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Превью"
                  className="downloadsbox__main-send-preview-image"
                />
              )}
            </div>
            <div className="downloadsbox__main-send-buttons">
              <button
                className="downloadsbox__main-send-buttons-cancel"
                onClick={handleCancel}
              >
                Отменить
              </button>
              <button
                className="downloadsbox__main-send-buttons-save"
                onClick={handleSubmit}
                >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          <label className="downloadsbox__main-label" htmlFor="avatar-input">
            <CiImageOn className="downloadsbox__main-label-icon" />
            <p className="downloadsbox__main-label-text">
              Загрузить изображение
            </p>
          </label>
        )}
      </div>
    </div>
  );
};

export default BannerDownload;
