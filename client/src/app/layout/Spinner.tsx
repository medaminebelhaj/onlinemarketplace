import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props{
message?: string ;

}

export default function Spinner({message = 'Loading...'}:Props){

return(
  <Backdrop open={true} invisible={true}>

    <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    height="100vh"
    >
        
    </Box>
    <CircularProgress size={100} color="secondary"/> 
    <Typography variant="h4" sx={{mt:2}}>{message}</Typography>  
  </Backdrop>


)


}