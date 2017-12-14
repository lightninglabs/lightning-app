const React = require('react')
const {Link} = require('react-router-dom');

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Person from 'material-ui/svg-icons/social/person'
import Person2 from 'material-ui/svg-icons/social/person-outline'



class Lobby extends React.Component {
  constructor(props) {
    super(props)
  }

  // Used for displaying the number of players in a game
  playerContainer(numPlayers) {
    let playerArray = [];
    for (var i = 0; i < 8; i ++) {
      if(numPlayers) {
        playerArray.push(1)
        numPlayers --;
      } else {
        playerArray.push(0)
      }
    }

    return playerArray;
  }

  // Used for displaying the state of the game room
  determineGameState(gameData) {
    if(gameData.activePlayers === 8) return 'FULL';
    return 'OPEN'
  }

  colorGenerator(gameName) {
    const chars = gameName.split("");
    const len = Math.floor((gameName.length)/3);
    const first = chars.slice(0,len).reduce( (sum, x) => sum + x.charCodeAt(0), 0) % 256;
    const second = chars.slice(len, len*2).reduce( (sum, x) => sum + x.charCodeAt(0), 0) % 256;
    const third = chars.slice(len*2, len*3+1).reduce( (sum, x) => sum + x.charCodeAt(0), 0) % 256;
    return [first, second, third]
  }

  render() {
    return (
      <Table
        onCellClick={this.props.handleGameHostClick.bind(this)}
        style={{
          width: '100%',
          height: '500px'
        }}
        >
     <TableHeader
       displaySelectAll={false}
       adjustForCheckbox={false}
       >
       <TableRow
         style={styles.cell}
         >
         <TableHeaderColumn
           style={Object.assign({},
             styles.cell,
             {flex: 1}
           )}
           >Room No.</TableHeaderColumn>
         <TableHeaderColumn
           style={Object.assign({},
             styles.cell,
             {flex: 1})}
           >Condition</TableHeaderColumn>
         <TableHeaderColumn
           style={Object.assign({},
             styles.cell,
             {flex: 5}
           )}
           >Players</TableHeaderColumn>
         <TableHeaderColumn
           style={Object.assign({},
             {flex: 3,},
             styles.cell)}
           >Room Name</TableHeaderColumn>
       </TableRow>
     </TableHeader>
     <TableBody
       displayRowCheckbox={false}
       >
        {
          this.props.hostedGames.map( (x,i) => {
            const c = this.colorGenerator(x.game_name);
            return (
              <TableRow
                key={i}
                style={{
                  display: 'flex',
                  backgroundColor: 'rgb('+ c[0] +',' + c[1] +',' + c[2] +')'
                }}
                >

                <TableRowColumn
                  style={Object.assign({},{
                    flex: 1,
                    fontSize: 14
                  }, styles.cell)}
                  >{x._id.slice(0,6)}
                </TableRowColumn>
                <TableRowColumn
                  style={Object.assign({},{
                    flex: 1,
                  }, styles.cell)}
                  >{this.determineGameState(x)}</TableRowColumn>
                <TableRowColumn
                  style={Object.assign({},{
                    flex: 5,
                  },styles.cell)}
                  >
                <div className="LobbyPage__player_container">
                  {
                  this.playerContainer(x.activePlayers).map( (x,i) => {
                    return x ? <Person key={i}/> : <Person2 key={i}/>
                  })
                }
              </div>
              </TableRowColumn>
                <TableRowColumn
                  style={Object.assign({},{
                    flex: 3,
                  },styles.cell)}
                  >{x.game_name}</TableRowColumn>
              </TableRow>
            )
          })
        }

     </TableBody>
   </Table>
  )
  }
}
const styles = {
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}
module.exports = Lobby
