import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { enableSections } from "../../api/trees";
import { useSnackbar } from "notistack";
import { TreeView, TreeItem } from "@mui/lab";
import { treeItemClasses } from "@mui/lab/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Edit, NoteAdd, CreateNewFolder } from "@mui/icons-material";
import EditTreeDialog from "./EditTreeDialog";
import AddTreeDialog from "./AddTreeDialog";
import AddFormDialog from "./AddFormDialog";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    height: "30pt",
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    iconColor,
    options,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color={iconColor} sx={{ mr: 1 }} />
          <Box
            sx={{
              width: "100%",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              marginRight: labelInfo,
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {labelText}
            </Typography>
          </Box>
          {options}
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const Sections = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { tree, form } = useForm();
  const [expanded, setExpanded] = useState([]);
  const [files, setFiles] = useState(["1"]);
  const [editDialog, setEditDialog] = useState(false);
  const [current, setCurrent] = useState(null);
  const [addTree, setAddTree] = useState(false);
  const [addForm, setAddForm] = useState(false);

  const optionFile = (tree) => {
    return (
      <Box sx={{ position: "absolute", right: "0", display: "inline-flex" }}>
        <Tooltip title="Editar">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setCurrent({ title: tree.title, id: +tree.id });
              setEditDialog(true);
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Añadir sección">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setCurrent({ title: tree.title, id: +tree.id });
              setAddTree(true);
            }}
          >
            <CreateNewFolder />
          </IconButton>
        </Tooltip>
        <Tooltip title="Añadir encuesta">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setCurrent({ title: tree.title, id: +tree.id });
              setAddForm(true);
            }}
          >
            <NoteAdd />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const handleEnableSections = () => {
    try {
      enableSections(form);
      enqueueSnackbar("Secciones habilitadas correctamente", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Ocurrió un error al activar las secciones", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    tree &&
      tree.subTrees.forEach((subTree, i) => {
        setFiles((files) => [...files, i + 2 + ""]);
      });
  }, [tree]);

  const handleExpandClick = () => {
    setExpanded((oldExpanded) => (oldExpanded.length === 0 ? files : []));
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const buildTree = (tree) => (
    <StyledTreeItem
      nodeId={tree.id + ""}
      key={tree.id}
      labelIcon={FolderIcon}
      labelText={tree.title}
      iconColor={"#ffd200"}
      options={optionFile(tree)}
      labelInfo={"85pt"}
    >
      {tree.children.map((doc) => (
        // Se construyen las encuestas hijas si es que tiene
        <StyledTreeItem
          key={doc.id}
          nodeId={doc.id}
          labelIcon={ArticleIcon}
          labelText={doc.title}
          iconColor={"#4B7ABC"}
          labelInfo={"0pt"}
          onClick={(e) => {
            navigate("/forms/edit/" + doc.id);
          }}
        />
      ))}
      {tree.subTrees.map((subTree, i) => {
        // Ahora se construyen los subarboles si es que tiene
        return buildTree(subTree);
      })}
    </StyledTreeItem>
  );

  return (
    <Box>
      <EditTreeDialog
        open={editDialog}
        setOpen={setEditDialog}
        data={current}
      />
      <AddTreeDialog open={addTree} setOpen={setAddTree} data={current} />
      <AddFormDialog open={addForm} setOpen={setAddForm} data={current} />
      {form && form.treeId ? (
        <Box sx={{ maxWidth: "400pt", margin: "auto" }}>
          {tree.subTrees && tree.subTrees.length > 0 ? (
            <Button fullWidth onClick={handleExpandClick}>
              {expanded.length === 0 ? "Expandir todos" : "Colapsar todos"}
            </Button>
          ) : null}
          <TreeView
            defaultEndIcon={<div style={{ width: 24 }} />}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            expanded={expanded}
            onNodeToggle={handleToggle}
          >
            {buildTree(tree)}
          </TreeView>
        </Box>
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
