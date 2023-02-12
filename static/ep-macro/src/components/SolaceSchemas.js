import { useEffect, useState, Fragment } from "react"
import { invoke } from '@forge/bridge';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import Pagination from '@atlaskit/pagination';
import {
  Content,
  Main,
  PageLayout,
} from '@atlaskit/page-layout';
import '../common/stati.css';

import {
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer,
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const Schema = (props) => {
  const { schema, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (schema.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(schema.description), type: 'String'});
  if (schema.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: '<i>(' + schema.versionsCount + ') found</i>', type: 'Version', url: schema.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (schema.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: schema.domainName, type: 'String', url: schema.domainUrl});
  if (schema.hasOwnProperty('shared')) rows.push({name: 'Shared', value: schema.shared ? 'True' : 'False', type: 'String'});
  if (schema.hasOwnProperty('type')) rows.push({name: 'Type', value: schema.type, type: 'String'});
  if (schema.hasOwnProperty('contentType')) rows.push({name: 'Content Type', value: schema.contentType, type: 'String'});
  if (schema.hasOwnProperty('schemaType')) rows.push({name: 'Schema Type', value: schema.schemaType, type: 'String'});
  if (schema.hasOwnProperty('eventVersionRefCount')) rows.push({name: 'Referring Event Versions count', value: '' + schema.eventVersionRefCount, type: 'String'});
  if (schema.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(schema.createdTime).toLocaleString(), type: 'String'});
  if (schema.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(schema.updatedTime).toLocaleString(), type: 'String'});
  console.log('REFCOUNT', schema.eventVersionRefCount);
  if (schema.customAttributes && schema.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + schema.customAttributes.length + ') found</i>', type: 'String'});
    schema.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Schema', value: schema.name, url: schema.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceSchemas = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible} = props;
  const [schemas, setSchemas] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      console.log('SolaceSchemas Token', token);
      (async () => {
        const schemas = await invoke('get-ep-resource', {command, token: token.value});
        console.log(schemas);
        setSchemas(schemas);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!schemas && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Schemas <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Schemas</p>
      </SectionMessage>
    )  
  }

  const getPageButtons = (num) => {
    if (num <= 1)
      return "";

    let arr = [];
    for (let i=0; i<num; i++)
      arr.push(i+1)
    
    return <Pagination pages={arr} selectedIndex={page-1} onChange={paginate} />
  }

  const fetchVersions = (url) => {
    let vUrl = url.replace('schemas', 'schemaVersions');
    navigate(vUrl);
  }
console.log('IN SOLACE SCHEMAS', schemas?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Schemas</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {schemas?.data.length && schemas.data.map((schema, index) => {
              return <Schema key={index} navigate={fetchVersions} schema={schema} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {schemas.meta && schemas.meta.pagination &&
            getPageButtons(schemas.meta.pagination.totalPages)}
          {(!schemas.meta || !schemas.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
