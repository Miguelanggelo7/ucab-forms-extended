import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useNavigate } from "react-router-dom";
import { getNotifications, readNotifications } from "../api/notifications";
import { useUser } from "../hooks/useUser";
import { useFont } from "../hooks/useFont";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [reading, setReading] = useState(false);
  const navigate = useNavigate();
  const user = useUser();
  const { font } = useFont();

  const popupStateNotifications = usePopupState({
    variant: "popover",
    popupId: "notifications-menu",
  });

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => notification.read === false)
      .length;
  }, [notifications]);

  useEffect(() => {
    return getNotifications(user.id, (notifications) => {
      setNotifications(notifications);
    });
  }, [user.id]);

  const handleClick = async (e) => {
    bindTrigger(popupStateNotifications).onClick(e);
    setReading(true);
    await readNotifications(user.id, notifications);
    setReading(false);
  };

  return (
    <>
      <Tooltip title="Notificaciones" arrow>
        <IconButton
          size="large"
          color="inherit"
          {...bindTrigger(popupStateNotifications)}
          onClick={handleClick}
        >
          <Badge badgeContent={reading ? 0 : unreadCount} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        MenuListProps={{
          dense: true,
        }}
        PaperProps={{
          sx: {
            maxHeight: 300,
            maxWidth: 350,
          },
        }}
        {...bindMenu(popupStateNotifications)}
      >
        {!notifications.length && <MenuItem>No hay notificaciones</MenuItem>}
        {notifications.map((notification, i) => [
          <MenuItem
            onClick={() => navigate(notification.goto)}
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: font.family,
              fontSize: `${font.size}px`,
            }}
          >
            {notification.message}
          </MenuItem>,
          notifications[i + 1] && <Divider />,
        ])}
      </Menu>
    </>
  );
};

export default Notifications;
