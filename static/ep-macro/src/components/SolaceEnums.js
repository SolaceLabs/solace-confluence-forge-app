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

const Enum = (props) => {
  const { ennum, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (ennum.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(ennum.description), type: 'String'});
  if (ennum.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: '<i>(' + ennum.versionsCount + ') found</i>', type: 'Version', url: ennum.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (ennum.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: ennum.domainName, type: 'String', url: ennum.domainUrl});
  if (ennum.hasOwnProperty('shared')) rows.push({name: 'Shared', value: ennum.shared ? 'True' : 'False', type: 'String'});
  if (ennum.hasOwnProperty('type')) rows.push({name: 'Type', value: ennum.type, type: 'String'});
  if (ennum.hasOwnProperty('contentType')) rows.push({name: 'Content Type', value: ennum.contentType, type: 'String'});
  if (ennum.hasOwnProperty('ennumType')) rows.push({name: 'Enum Type', value: ennum.ennumType, type: 'String'});
  if (ennum.hasOwnProperty('eventVersionRefCount')) rows.push({name: 'Referring Event Versions count', value: '' + ennum.eventVersionRefCount, type: 'String'});
  if (ennum.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(ennum.createdTime).toLocaleString(), type: 'String'});
  if (ennum.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(ennum.updatedTime).toLocaleString(), type: 'String'});
  if (ennum.customAttributes && ennum.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + ennum.customAttributes.length + ') found</i>', type: 'String'});
    ennum.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Enum', value: ennum.name, url: ennum.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEnums = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [ennums, setEnums] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const ennums = await invoke('get-ep-resource', {command, token: token.value});
      console.log(ennums);
      if (ennums.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(ennums.message);
      } else {
        setEnums(ennums);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!ennums && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Enums <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Enums</p>
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
    let vUrl = url.replace('enums', 'enumVersions');
    navigate(vUrl);
  }
console.log('IN SOLACE ENUMS', ennums?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Enums</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {ennums?.data.length && ennums.data.map((ennum, index) => {
              return <Enum key={index} navigate={fetchVersions} ennum={ennum} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {ennums.meta && ennums.meta.pagination &&
            getPageButtons(ennums.meta.pagination.totalPages)}
          {(!ennums.meta || !ennums.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
