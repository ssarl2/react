import React, { Component } from 'react';
/*
 simple list
 */
class App1 extends Component {
    state = {
        boards: [
            {
                brdno: 1,
                brdwriter: 'Lee SunSin',
                brdtitle: 'If you intend to live then you die',
                brddate: new Date()
            },
            {
                brdno: 2,
                brdwriter: 'So SiNo',
                brdtitle: 'Founder for two countries',
                brddate: new Date()
            }
        ]
    }

    render() {

        const al = () => {
            alert("WAK!!");
        };

        const warning = <button onClick={al}>Wang</button>

        const { boards } = this.state;
        const list = boards.map(function(row){ 
            return row.brdno + row.brdwriter ;
        });
        
        return (
            <div>
                {list}
                {warning}
            </div>
        );
    }
}

export default App1;
