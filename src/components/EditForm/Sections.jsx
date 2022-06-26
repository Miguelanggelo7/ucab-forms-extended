import React from "react";
import { useForm } from "../../hooks/useForm";
import { Box, Button, Typography } from "@mui/material";
import { enableSections } from "../../api/trees";
import { useSnackbar } from "notistack";
import { TreeView, TreeItem } from "@mui/lab";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";

const Sections = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { tree, form } = useForm();

  const handleEnableSections = () => {
    try {
      const ref = enableSections(form);
      console.log(ref);
      enqueueSnackbar("Secciones habilitadas correctamente", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Ocurrió un error al activar las secciones", {
        variant: "error",
      });
    }
  };

  /*
    TODO:
      que al colocar los iconos de carpeta y articulo, no se quiten el icono de colapsar y expandir
      agregar boton de expandir todos y colapsar todos
      agregar boton para añadir encuesta
  */

  const buildTree = (tree) => (
    <TreeItem
      nodeId={tree.id + ""}
      key={tree.id}
      icon={<FolderIcon />}
      label={tree.title}
    >
      {tree.children.map((doc) => (
        // Se construyen las encuestas hijas si es que tiene
        <TreeItem
          key={doc.id}
          nodeId={doc.id}
          icon={<ArticleIcon />}
          label={doc.title}
          onClick={() => {
            navigate("/forms/edit/" + doc.id);
          }}
        />
      ))}
      {tree.subTrees.map((subTree) => {
        // Ahora se construyen los subarboles si es que tiene
        return buildTree(subTree);
      })}
    </TreeItem>
  );

  return (
    <Box>
      {form && form.treeId ? (
        <TreeView
          defaultEndIcon={<div style={{ width: 24 }} />}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
        >
          {buildTree(tree)}
        </TreeView>
      ) : (
        <Box>
          <Typography>
            Al parecer haz habilitado las secciones para esta encuesta.
          </Typography>
          <Typography>
            Esto te permitira dividir tu encuesta en carpetas y subcarpetas, asi
            como permitirte crear mas encuestas dentro para poder mantener un
            mejor control.
          </Typography>
          <Button variant="contained" onClick={handleEnableSections}>
            Click aqui para habilitarla
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Sections;
