import React from 'react';
import { Dialog, TextField, FlatButton } from 'material-ui';

export default ({open, handleClose, handleGameHostConnect, game}) => {
  const actions_connect = [
    <FlatButton
      label={'Cancel'}
      primary={true}
      onClick={handleClose.bind(this)}
    />,
    <FlatButton
      label={'Connect'}
      primary={true}
      onClick={handleGameHostConnect.bind(this)}
    />
  ];

  return (
    <Dialog
      title={game.game_name}
      actions={actions_connect}
      modal={true}
      open={open}
    >
      Players in game: {game.activePlayers} <br />
      Hosted at: {game.external_ip}
    </Dialog>
  );
}
