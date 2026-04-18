import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Box
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";

import "./styles.css";

/* ---------- Comment List Component ---------- */
function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      <h4>Comments</h4>
      {comments.map((c) => (
        <div key={c._id} style={{ marginBottom: "10px" }}>
          <div>
            <Link to={`/users/${c.user._id}`}>
              <strong>{c.user.first_name} {c.user.last_name}</strong>
            </Link>
          </div>

          <div style={{ fontSize: "0.9em", color: "gray" }}>
            {c.date_time}
          </div>

          <div>{c.comment}</div>
        </div>
      ))}
    </div>
  );
}
/* ---------- Single Photo Card ---------- */
function PhotoCard({ photo, children }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={
          <Typography variant="subtitle1" color="textSecondary">
            {photo.date_time}
          </Typography>
        }
      />

      {/* 👉 Nút đặt lên đầu */}
      {children}

      <CardMedia
        component="img"
        image={`/images/${photo.file_name}`}
        alt={photo.file_name}
        sx={{ maxWidth: "100%", objectFit: "contain" }}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Divider />
        <CommentList comments={photo.comments} />
      </CardContent>
    </Card>
  );
}

/* ---------- Main Component ---------- */
function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const { advancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  const [photoList, setPhotoList] = useState([]);

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then(setPhotoList)
      .catch(console.error);
  }, [userId]);

  if (!photoList) {
    return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  }

  if (photoList.length === 0) {
    return <Typography sx={{ p: 2 }}>No photos found for this user.</Typography>;
  }

  /* ---------- Advanced Mode ---------- */
  if (advancedFeaturesEnabled) {
    const currentPos = photoId
      ? Math.max(photoList.findIndex(p => p._id === photoId), 0)
      : 0;

    const currentPhoto = photoList[currentPos];

    return (
      <div style={{ padding: 16 }}>
        <PhotoCard photo={currentPhoto}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="contained"
              disabled={currentPos === 0}
              onClick={() =>
                navigate(`/photos/${userId}/${photoList[currentPos - 1]._id}`)
              }
            >
              Previous
            </Button>

            <Button
              variant="contained"
              disabled={currentPos === photoList.length - 1}
              onClick={() =>
                navigate(`/photos/${userId}/${photoList[currentPos + 1]._id}`)
              }
            >
              Next
            </Button>
          </Box>
        </PhotoCard>
      </div>
    );
  }

  /* ---------- Normal Mode ---------- */
  return (
    <div style={{ padding: 16 }}>
      {photoList.map((p) => (
        <PhotoCard key={p._id} photo={p} />
      ))}
    </div>
  );
}

export default UserPhotos;