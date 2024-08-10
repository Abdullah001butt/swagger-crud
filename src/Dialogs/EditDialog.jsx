import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditDialog = ({ open, handleClose, handleSave, country }) => {
  const [name, setName] = useState(country.name);
  const [selectedImage, setSelectedImage] = useState(country.flag.file_content);

  useEffect(() => {
    setName(country.name);
    setSelectedImage(country.flag.file_content);
  }, [country]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageDataUrl = reader.result;
        setSelectedImage(imageDataUrl); // Update the state with the new image data URL
        console.log("Image updated:", imageDataUrl); // Debugging log
      };
      reader.onerror = (error) => console.error("Error reading file:", error);
    }
  };

  const handleSaveClick = () => {
    handleSave({
      ...country,
      name,
      flag: { ...country.flag, file_content: selectedImage },
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Country</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input type="file" onChange={handleFileChange} />
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "100%", marginTop: "10px" }}
            key={selectedImage}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
