import { useEffect, useState, Fragment, Text } from "react"
import { invoke } from '@forge/bridge';
import ReactHtmlParser from 'react-html-parser'; 
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import Pagination from '@atlaskit/pagination';
import Button from '@atlaskit/button';  
import {
  Content,
  Main,
  PageLayout,
} from '@atlaskit/page-layout';
import '../common/stati.css';

import {
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer, MainContainer, ContentContainer,
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const SchemaVersion = (props) => {
  const { schema, navigate, openModal, homeUrl } = props;
console.log('SchemaVersion', props)
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();

  if (schema.hasOwnProperty('displayName')) 
    rows.push({name: 'Schema Version', 
                value: (schema.displayName ? schema.version + " [" + schema.displayName + "]" : schema.version), 
                type: 'String', url: schema.versionUrl});
  else
    rows.push({name: 'Schema Version', value: schema.version, type: 'String', url: schema.versionUrl});
  
  if (schema.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(schema.description), type: 'String'});
  if (schema.hasOwnProperty('state')) rows.push({name: 'State', value: schema.state, type: 'String'});
  if (schema.hasOwnProperty('schemaName')) rows.push({name: 'Schema Name', value: schema.schemaName, type: 'String', url: schema.schemaUrl, navigate: navigate});
  if (schema.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: schema.domainName, type: 'String', url: schema.domainUrl});
  if (schema.hasOwnProperty('content')) rows.push({key: schema.id, name: 'Content', value: schema.contentSize, open: openModal, type: 'Content', title: 'Fetch Schema'});
  
  if (schema.customAttributes && schema.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + schema.customAttributes.length + ') found</i>', type: 'String'});
    schema.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    });
  }

  if (schema.referencedByEventVersionIds && schema.referencedByEventVersionIds.length) {
    rows.push({name: 'Referring Event Versions', value: '<i>(' + schema.referringEvents.length + ') found</i>', type: 'String'});
    schema.referringEvents.map(ca => {
      if (!ca.eventId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventName, type: 'String', url: ca.eventUrl},
        (schema.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Schema Version', value: schema.name, url: schema.url}} 
      counts={counts} 
      open={openModal}
      rows={rows} />
  )
}

export const SolaceSchemaVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [schemaVersions, setSchemasVersions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [versionKey, setVersionKey] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('SolaceSchemaVersions Token', token);
    (async () => {
      const schemaVersions = await invoke('get-ep-resource', {command, token: token.value});
      console.log(schemaVersions);
      if (schemaVersions.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(schemaVersions.message);
      } else {
        setSchemasVersions(schemaVersions);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!schemaVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Schema Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Schema Versions</p>
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

  const goHome = () => {
    navigate(homeUrl);
  }

  const openModal = (key) => {
    console.log('Modal Opened', key);
    setVersionKey(key);
    setOpenDialog(true);
  }

  const getContent = () => {
    let content = schemaVersions?.data.find(s => s.id === versionKey)?.content;
    return content ? ReactHtmlParser (content.replaceAll('\n', '<br/>').replaceAll(' ', '&nbsp;')) : 'No schema specified';
  }

console.log('IN SOLACE SCHEMA VERSIONS', schemaVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Schema Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
            {openDialog &&
              <Fragment> 
                <ContentContainer>
                  <div>{getContent()}</div>
                </ContentContainer>
              </Fragment> 
            }
            {!openDialog &&
              <Fragment>
                {schemaVersions?.data.length && schemaVersions.data.map((schema, index) => {
                  console.log('Build SchemaVersion', index);
                  return <SchemaVersion navigate={goHome} openModal={openModal} schema={schema} />
                })}
              </Fragment>}              
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {schemaVersions.meta && schemaVersions.meta.pagination &&
            getPageButtons(schemaVersions.meta.pagination.totalPages)}
          {(!schemaVersions.meta || !schemaVersions.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
          {openDialog &&
            <div>
              <Button appearance="primary" onClick={() => setOpenDialog(false)}>Close</Button>
            </div>
          }
          {!openDialog && command.url !== homeUrl && homeUrl.indexOf('selectedVersionId') < 0 &&
            <Button appearance="primary" onClick={() => navigate(homeUrl)}>Back</Button>
          }
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
