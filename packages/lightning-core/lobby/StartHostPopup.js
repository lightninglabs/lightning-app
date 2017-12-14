import React from 'react';
import { Dialog, TextField, FlatButton } from 'material-ui';

export default ({open, handleStartHost, handleClose, handleInputGameName}) => {
  const actions_connect = [
    <FlatButton
      label={'Cancel'}
      primary={true}
      onClick={handleClose.bind(this)}
    />,
    <FlatButton
      label={'Connect'}
      primary={true}
      onClick={handleStartHost.bind(this)}
    />
  ];

  return (
    <Dialog
      title="Host a Game Room"
      actions={actions_connect}
      modal={true}
      open={open}
    >
      <TextField
        hintText="Game Name"
        onChange={handleInputGameName.bind(this)}
      />
    </Dialog>
  );
}
