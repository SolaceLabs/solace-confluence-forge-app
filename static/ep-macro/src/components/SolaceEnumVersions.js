import { useEffect, useState, Fragment } from "react"
import { invoke } from '@forge/bridge';
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
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer,
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const EnumVersion = (props) => {
  const { ennum, navigate, homeUrl } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();

  rows.push({name: 'Enum Name', value: ennum.enumName, type: 'String', url: ennum.enumUrl});

  if (ennum.hasOwnProperty('displayName')) 
    rows.push({name: 'Enum Version', 
                value: (ennum.displayName ? ennum.version + " [" + ennum.displayName + "]" : ennum.version), 
                type: 'String', url: ennum.versionUrl});
  else
    rows.push({name: 'Enum Version', value: ennum.version, type: 'String', url: ennum.versionUrl});
  
  if (ennum.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(ennum.description), type: 'String'});
  if (ennum.hasOwnProperty('state')) rows.push({name: 'State', value: ennum.state, type: 'String'});
  if (ennum.hasOwnProperty('ennumName')) rows.push({name: 'Enum Name', value: ennum.ennumName, type: 'String', url: ennum.ennumUrl, navigate: navigate});
  if (ennum.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: ennum.domainName, type: 'String', url: ennum.domainUrl});
  
  if (ennum.values && ennum.values.length) {
    rows.push({name: 'Enumeration Values', value: '<i>(' + ennum.values.length + ') found</i>', type: 'String'});
    ennum.values.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Label:', value: ca.label, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'},
        {name: 'Created Time:', value: new Date(ca.createdTime).toLocaleString(), type: 'String'},
        {name: 'Updated Time:', value: new Date(ca.updatedTime).toLocaleString(), type: 'String'}
      ]});
    });
  }

  if (ennum.customAttributes && ennum.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + ennum.customAttributes.length + ') found</i>', type: 'String'});
    ennum.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    });
  }

  if (ennum.referencedByEventVersionIds && ennum.referencedByEventVersionIds.length) {
    rows.push({name: 'Referring Event Versions', value: '<i>(' + ennum.referringEvents.length + ') found</i>', type: 'String'});
    ennum.referringEvents.map(ca => {
      if (!ca.eventId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventName, type: 'String', url: ca.eventUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Enum Version', value: ennum.name, url: ennum.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEnumVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [ennumVersions, setEnumsVersions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('SolaceEnumVersions Token', token);
    (async () => {
      const ennumVersions = await invoke('get-ep-resource', {command, token: token.value});
      console.log(ennumVersions);
      if (ennumVersions.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(ennumVersions.message);
      } else {
        setEnumsVersions(ennumVersions);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!ennumVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Enum Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Enum Versions</p>
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

console.log('IN SOLACE ENUM VERSIONS', ennumVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Enum Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {ennumVersions?.data.length && ennumVersions.data.map((ennum, index) => {
              return <EnumVersion key={index} navigate={goHome} ennum={ennum} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {ennumVersions.meta && ennumVersions.meta.pagination &&
            getPageButtons(ennumVersions.meta.pagination.totalPages)}
          {(!ennumVersions.meta || !ennumVersions.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
          {command.url !== homeUrl && homeUrl.indexOf('selectedVersionId') < 0 &&
            <Button appearance="primary" onClick={() => navigate(homeUrl)}>Back</Button>}
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
