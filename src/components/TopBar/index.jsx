import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import { useLocation, matchPath } from "react-router-dom";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

function TopBar() {
  const location = useLocation();
  const { advancedFeaturesEnabled, setAdvancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  const [title, setTitle] = useState("");

  // 👉 tách logic ra hàm riêng
  const loadUserInfo = async (id, isPhotoPage = false) => {
    try {
      const user = await fetchModel(`/user/${id}`);
      const name = `${user.first_name} ${user.last_name}`;
      setTitle(isPhotoPage ? `Photos of ${name}` : name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const path = location.pathname;

    const matchUser = matchPath("/users/:userId", path);
    const matchPhoto = matchPath("/photos/:userId", path);

    if (matchUser?.params?.userId) {
      loadUserInfo(matchUser.params.userId);
      return;
    }

    if (matchPhoto?.params?.userId) {
      loadUserInfo(matchPhoto.params.userId, true);
      return;
    }

    setTitle("");
  }, [location.pathname]);

  return (
    <AppBar position="absolute" className="topbar-appBar">
      <Toolbar>
        {/* Left */}
        <Typography variant="h5">
          Lê Doãn Trung - B23DCCN854
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Toggle */}
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedFeaturesEnabled}
              onChange={(e) => setAdvancedFeaturesEnabled(e.target.checked)}
              sx={{
                color: "white",
                "&.Mui-checked": { color: "white" }
              }}
            />
          }
          label="Enable Advanced Features"
          sx={{ mr: 2 }}
        />

        {/* Right */}
        <Typography variant="h5">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;