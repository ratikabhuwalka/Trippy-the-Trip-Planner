import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { mockItinerayByUser } from './utils/Itinerary_mock_data';
import moment from 'moment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import AvatarGroup from '@mui/material/AvatarGroup';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {Link} from 'react-router-dom'
import { publicRequest } from "./api/http";



export default function ItineraryCard(props) {
  const [itinerary, setItinerary] = React.useState(props.itinerary)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [visibilityMenu, setVisibilityMenu] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleVisibilityMenuClick = (event) => {
    setVisibilityMenu(event.currentTarget);
  };
  const handleVisibilityMenuClose = () => {
    setVisibilityMenu(null);
  };
  const user = useSelector((state) => state.user.currentUser);
  const [isFavorite, setIsFavorite] =  useState(props.itinerary.isFavorite)
  const [isPublic, setIsPublic] =  useState(props.itinerary.isPublic)



  useEffect(() => {

}, [isFavorite, isPublic]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.toUpperCase().split(' ')[0][0]}`,
    };
  }
  
  const members = (    
        <> 
        <AvatarGroup max={5} sx={{ marginLeft : 1,marginRight: 17,  width: 100 }}>
        {itinerary.members.map((member, index) => (
          <Tooltip title={member.username}>
            <Avatar alt={member.username}  {...stringAvatar(member.username)} />
          </Tooltip>
        ))}
        
      </AvatarGroup>
      </>
      )

    async function handleFavClick()
    {

        setIsFavorite(true)
        await publicRequest.put('/itinerary/favorite', { itineraryId:itinerary._id, userId: user._id, isFavorite:true});
    }

    async function handleRemoveFavClick()
    {
        setIsFavorite(false)

        await publicRequest.put('/itinerary/favorite',{ itineraryId:itinerary._id, userId: user._id, isFavorite:false});
    }



  return (
    <Card sx={{ maxWidth: 400, maxHeight:300 }}>
        
      <CardHeader
        avatar={
        <Tooltip title={itinerary.createdBy.username}>
          <Avatar  alt={itinerary.createdBy.username} sx={{ bgcolor: red[500], height: '50px', width: '50px'  }} aria-label="itinerary">
            {itinerary.createdBy.username.toUpperCase().split(' ')[0][0]}
          </Avatar>
        </Tooltip>
          
        }
        action={<>
           <IconButton
                aria-label="3-dots"
                id= "itinerary-button"//"long-button"
                aria-controls={open ? 'itinerary-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="itinerary-menu"
                MenuListProps={{
                'aria-labelledby': 'itinerary-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
    
            {
                itinerary.createdBy._id == user._id ? <MenuItem > 
                <DeleteOutlinedIcon  sx={{ fontSize: 30 }} className="itinerary__icons" />   Delete Trip 
                </MenuItem>
                : <MenuItem title="Leave Itinerary"> 
                    <ExitToAppIcon sx={{ fontSize: 30 }} className="itinerary__icons" />   Leave Trip
                </MenuItem>
              } 
            <MenuItem >   <DownloadIcon  sx={{ fontSize: 30 }} className="itinerary__icons" /> Download </MenuItem>
            </Menu>
         </>
        }
        title={
             <Typography gutterBottom variant="h6" component="div">
                {itinerary.itineraryName}        
            </Typography>}
        subheader= {`${moment(itinerary.startDate).format('MMMM Do')} - ${moment(itinerary.endDate).format('MMMM Do')}`} 

      />
    <Link to={`/itinerary/${itinerary._id}`} style={{ textDecoration: 'none' }}> 

      <CardMedia
        component="img"
        height="150"
        image="https://media.timeout.com/images/105770969/1372/772/image.jpg"
        alt="Paella dish"
      />
</Link>
      <CardActions disableSpacing>
        {members}
        {isPublic? <Tooltip title="Visible visible pulblicly">
            <PublicOutlinedIcon aria-label = "Visible publicly"
             onClick={handleVisibilityMenuClick} />
            <Menu
                id="itinerary-menu"
                MenuListProps={{
                'aria-labelledby': 'itinerary-button',
                }}
                anchorEl={visibilityMenu}
                open={open}
                onClose={handleVisibilityMenuClose}
            >
            <MenuItem > <PeopleOutlineOutlinedIcon sx={{ fontSize: 30 }} className="itinerary__icons" /> Make it Private </MenuItem>
            </Menu>
        </Tooltip> : <Tooltip title="Visible to members only">
            <PeopleOutlineOutlinedIcon aria-label = "Visible to Members" style= {{height:"30px", width:"30px"}}
            onClick={handleVisibilityMenuClick}/> 
            {/* <Menu
                id="itinerary-menu"
                MenuListProps={{
                'aria-labelledby': 'itinerary-button',
                }}
                anchorEl={visibilityMenu}
                open={open}
                onClose={handleVisibilityMenuClose}
            >
            <MenuItem > <PublicOutlinedIcon sx={{ fontSize: 30 }} className="itinerary__icons" /> Make it Public </MenuItem>
            </Menu> */}
        </Tooltip>}
         {isFavorite? 
        <Tooltip title="Remove from Favorites" onClick={handleRemoveFavClick}>
            <FavoriteIcon aria-label = "Favorite"  />
        </Tooltip>:
        <Tooltip title = "Add to Favorites">
        <FavoriteBorderIcon aria-label = "Unfavorite" onClick = {handleFavClick} style= {{height:"30px", width:"30px"}}/>
        </Tooltip>}
        
 
     

      </CardActions>
    </Card>
  );
}
