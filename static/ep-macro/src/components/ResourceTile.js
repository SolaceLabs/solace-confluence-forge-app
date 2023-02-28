import DynamicTable from '@atlaskit/dynamic-table';
import { Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser'; 
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import Button from '@atlaskit/button';   
import { router } from '@forge/bridge';

export const ResourceTile = (props) => {
  const { name, rows } = props;
  const openLink = (e) => {
    router.open(e.currentTarget.dataset.url);
  }

  const getValue = (row) => {
    if (row.type === 'String' || row.type === 'Version') {
      if (row.url) 
        return (
          <div>
            {ReactHtmlParser (row.value)}
            &nbsp;<a href="#" data-url={row.url} onClick={openLink} target="_blank"><ShortcutIcon size="small" label=""/></a>
          </div>
        );

      return ReactHtmlParser (row.value);
    } else if (row.type === 'Content') {
      return (
        <div>
          {ReactHtmlParser (row.value)}
        </div>
      );
    }else if (row.type === 'Table') {   
      return (
        <div>
          {row.value.map((v, index) => {
             return (
              v.url ?
                <div key={index}>
                  <b>{v.name}</b> {ReactHtmlParser (v.value)}
                  &nbsp;<a href="#" data-url={v.url} onClick={openLink} target="_blank"><ShortcutIcon size="small" label=""/></a> 
                </div> :
                <div key={index}>
                  <b>{v.name}</b> {ReactHtmlParser (v.value)}
                </div>
             );             
          })}
        </div>
      )
    }
  };


  const tRows = [];
  rows.map((row, index) => {
    if (row.type === 'Version') {
      tRows.push({
        key: index,
        cells: [
          { key: index + '-1', content: <div style={{padding: 7}}><b>{row.name}</b></div> },
          { key: index + '-2', content: <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                          <span style={{textAlign: 'left'}}>{ getValue(row) } </span>
                                          <span style={{float: 'right'}}>
                                            <Button appearance="primary" onClick={() => row.navigate(row.url)}>{row.title}</Button>
                                          </span>
                                        </div>}
        ]
      })
    } else if (row.type === 'Content') {
      tRows.push({
        key: index,
        cells: [
          { key: index + '-1', content: <div style={{padding: 7}}><b>{row.name}</b></div> },
          { key: index + '-2', content: <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                          <span style={{textAlign: 'left'}}>{ getValue(row) } </span>
                                          <span style={{float: 'right'}}>
                                            <Button appearance="primary" onClick={() => row.open(row.key)}>{row.title}</Button>
                                          </span>
                                        </div>}
        ]
      })
    } else {
      tRows.push({
        key: index,
        cells: [
          { key: index + '-1', content: <div style={{ paddingLeft: 7}}><b>{row.name}</b></div> },
          { key: index + '-2', content: <div style={{textAlign: 'left'}}>{ getValue(row) } </div>}
        ]
      })
    }
  })
  
  console.log('ROWS', rows);
  const head = {
    cells: [
      {
        key: 'Col1',
        width: 200,
      },
      {
        key: 'Col2',
        width: 500
      } 
  ]};

  return (
    <Fragment>
      <h5 style={{padding:7, marginBottom: -7, backgroundColor: '#f3f3f3'}}>
        {name.name}: <b><span style={{color: '#00cc91'}}>{ReactHtmlParser (name.value)}</span></b>
        &nbsp;<a href="#" data-url={name.url} onClick={openLink} target="_blank"><ShortcutIcon size="small" label=""/></a>
      </h5>

      {rows.length > 0 && 
        <Fragment>
          <div style={{padding: 0}}>
            <DynamicTable isFixedSize={true} head={head} rows={tRows} />
          </div>
        </Fragment>
      }
    </Fragment>
  );
}