import React, { useEffect, useState, Fragment } from 'react';
import { invoke } from '@forge/bridge';
import { router } from '@forge/bridge';

// Atlaskit
import Spinner from '@atlaskit/spinner';
import Image from '@atlaskit/image';
import Button from '@atlaskit/button';  
// Custom Styles
import {
  Card, LoadingContainer, BannerContainer, MainContainer, MainPreloadContainer, EPUrlContainer
} from './Styles';
import {
  SummaryActions, SummaryCount, SummaryFooter
} from './Styles';

import SolaceLogo from './images/solace.png';
import Blanket from '@atlaskit/blanket';
import Lozenge from '@atlaskit/lozenge';
import { SolaceDomains } from './components/SolaceDomains';
import { SolaceApplications } from './components/SolaceApplications';
import { SolaceApplicationVersions } from './components/SolaceApplicationVersions';
import { SolaceEvents } from './components/SolaceEvents';
import { SolaceEventVersions } from './components/SolaceEventVersions';
import { SolaceSchemas } from './components/SolaceSchemas';
import { SolaceSchemaVersions } from './components/SolaceSchemaVersions';
import { SolaceEnumVersions } from './components/SolaceEnumVersions';
import { SolaceEnums } from './components/SolaceEnums';
import { SolaceEventApiVersions } from './components/SolaceEventApiVersions';
import { SolaceEventApis } from './components/SolaceEventApis';
import { SolaceEventApiProductVersions } from './components/SolaceEventApiProductVersions';
import { SolaceEventApiProducts } from './components/SolaceEventApiProducts';

function App() {
  const [baseConfig, setBaseConfig] = useState(null);
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [token, setToken] = useState(null);
  const [solCommand, setSolCommand] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [noTokenFound, setNoTokenFound] = useState(false);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [page, setPage] = useState(1);
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  
  const openLink = (e) => {
    router.open(e.currentTarget.dataset.url);
  }

  const getConfig = async () => {
    try {
      const config = await invoke('get-config');
      console.log('Current Config', config);
      setConfig(config);  
      setBaseConfig(config);
      return config;
    } catch(error) {
      console.log('Get Config failed');
      return null;
    }
  };
  
  const getToken = async (accountId) => {
    try {
      const token = await invoke('get-token', accountId);
      console.log('Current Token', token);
      setToken(token);
      return token;
    } catch(error) {
      console.log('Get EP Token failed');
    }
  };

  const getUser = async () => {
    try {
      const user = await invoke('get-user');
      console.log('Current User', user);
      setUser(user);
      setAccountId(user?.accountId);
      return user;
    } catch(error) {
      console.log('Get current user failed', error);
      return null;
    }
  };

  const initializeSolaceApp = async () => {
    const user = await getUser();
    const _token = await getToken(user?.accountId);
    const config = await getConfig();
    const command = await parseUrl(_token, config?.url, 5, page);
    setSolCommand(command);
    console.log('COMMAND', command);
  }

  const parseUrl = async(tkn, url, pageSize, pageNumber) => {
    try {
      const command = await invoke('parse-solace-link', {url, pageSize, pageNumber});
      if (!url) {
        console.log('Hmm.. missing url');
        return command;
      }

      console.log('PARSING', 'parse-solace-link', url, pageSize, pageNumber);
      console.log('Solace Command', command);

      setIsFetched(true);
      setRefresh(new Date().getMilliseconds());
      if (!tkn) {
        command.error = "Missing or invalid REST API token"
        setNoTokenFound(true);
      }

      return command;
    } catch(error) {
      const command = { pageSize: (pageSize ? pageSize : 5), pageNumber: (pageNumber ? pageNumber : 1), epDomain: url.hostname, url};
      command.error = 'Parse Solace Command failed';
      setIsFetched(true);
      setRefresh(new Date().getMilliseconds());    
      return command;
    }
  }

  const navigateTo = async (url) => {
    setConfig({url: url})
    const command = await parseUrl(token, url, 5, 1);
    setSolCommand(command);
    setRefresh(new Date().getMilliseconds());
  }

  const goBackOrigin = async () => {
    async function initToBack() {
      const url = baseConfig.url;
      const command = await parseUrl(token, url, 5, 1);
      setSolCommand(command);
      setFetchError(false);
      setIsFetched(true);
    };
    initToBack();
  }

  useEffect(() => {
    async function init() {
      await initializeSolaceApp();
      setIsFetched(true);
    };
    init();
  }, []);

  console.log('isFetched', isFetched, 'solCommand', solCommand);
  if (!isFetched || !solCommand) {
    return (
      <MainPreloadContainer>
        <LoadingContainer>
          <Spinner size="large" />
        </LoadingContainer>
      </MainPreloadContainer>
    );
  }

  if (isFetched && solCommand && solCommand.error) {
    return (
      <div>
        <div>
          <MainPreloadContainer>
            <BannerContainer>
              <Image src={SolaceLogo} style={{height: 36}} alt="Solace Logo"/>
              <span style={{marginRight: 10, fontSize: 14, fontWeight: 'bold'}}>Solace Event Portal</span>
            </BannerContainer>
            <div style={{padding: 5, width: '100% !important'}}>
              <Lozenge appearance="removed" isBold style={{width: '100% !important'}}>
                {noTokenFound ? `Error:` : `Invalid URL:`}
              </Lozenge> 
              <span>&nbsp;{solCommand.error}</span>
              <br/><br/>
              {!noTokenFound &&
                <span>To report this as bug/issue, you can open an issue on
                  <a href="#" data-url={`https://github.com/SolaceLabs/solace-confluence-forge-app/issues/new?title=A valid Event Portal URL is reported as invalid by the Solace Confluence App`
                      + `&body=` + baseConfig.url} onClick={openLink} target="_blank"> Github</a> or post it in <a href="#" data-url="https://solace.community" onClick={openLink} target="_blank"> Solace Community</a>
                </span>}
            </div>
            <SummaryFooter>
              <SummaryCount/>
              <SummaryActions>
                {solCommand.url && solCommand.url.indexOf('Versions') > 0 &&
                  <Button appearance="primary" onClick={goBackOrigin}>Back</Button>}
              </SummaryActions>
            </SummaryFooter>             
          </MainPreloadContainer>
          <EPUrlContainer style={{}}>
            URL: <a href="#" data-url={baseConfig.url} onClick={openLink} target="_blank">{baseConfig.url}</a>
          </EPUrlContainer>
        </div>
      </div>
    );
  }

  if (isFetched && solCommand && fetchError) {
    let errorString = fetchError;
    if (fetchError.indexOf('Error: ') >= 0)
      errorString = fetchError.substring(7);
    return (
      <div>
        <div>
          <MainPreloadContainer>
            <BannerContainer>
              <Image src={SolaceLogo} style={{height: 36}} alt="Solace Logo"/>
              <span style={{marginRight: 10, fontSize: 14, fontWeight: 'bold'}}>Solace Event Portal</span>
            </BannerContainer>
            <div style={{padding: 5, width: '100% !important'}}>
              <Lozenge appearance="removed" isBold style={{width: '100% !important'}}>
                Error:
              </Lozenge> 
              <span>&nbsp;{errorString}</span>
              <span> - Review your REST API Token permissions.</span>
            </div>
            <SummaryFooter>
              <SummaryCount/>
              <SummaryActions>
                {solCommand.url.indexOf('Versions') > 0 &&
                  <Button appearance="primary" onClick={goBackOrigin}>Back</Button>}
              </SummaryActions>
            </SummaryFooter>             
          </MainPreloadContainer>
          <EPUrlContainer style={{}}>
            URL: <a href="#" data-url={baseConfig.url} onClick={openLink} target="_blank">{baseConfig.url}</a>
          </EPUrlContainer>
        </div>
      </div>
    );
  }

  const paginate = async (e, toPage) => {
    e.preventDefault();
    if (page === toPage)
      return;

    setIsBlanketVisible(true);
    const command = await parseUrl(token, config?.url, 5, toPage);
    setSolCommand(command);
    setPage(toPage);
  }

  return (
    <div>
      <div>
        <MainContainer style={{display: 'flex', flexDirection: 'column'}}>
          {isBlanketVisible &&
            <Blanket
              isTinted={isBlanketVisible}
            />
          }

          <BannerContainer>
            <Image src={SolaceLogo} style={{height: 36}} alt="Solace Logo"/>
            <span style={{marginRight: 10, fontSize: 14, fontWeight: 'bold'}}>Solace Event Portal</span>
          </BannerContainer>

          {(isFetched && solCommand.resource === 'domains') &&
            <SolaceDomains 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              setFetchError={setFetchError}
            />
          }

          {(isFetched && solCommand.resource === 'applications') &&
            <SolaceApplications 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
            />
          }

          {(isFetched && solCommand.resource === 'applicationVersions') &&
            <SolaceApplicationVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />
          }

          {(isFetched && solCommand.resource === 'events') &&
            <SolaceEvents 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
            />}

          {(isFetched && solCommand.resource === 'eventVersions') &&
            <SolaceEventVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />
          }

          {(isFetched && solCommand.resource === 'schemas') &&
            <SolaceSchemas 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
            />}

          {(isFetched && solCommand.resource === 'schemaVersions') &&
            <SolaceSchemaVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />
          }

          {(isFetched && solCommand.resource === 'enums') &&
            <SolaceEnums
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              setFetchError={setFetchError}
              navigate={navigateTo}
            />}

          {(isFetched && solCommand.resource === 'enumVersions') &&
            <SolaceEnumVersions
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />}

          {(isFetched && solCommand.resource === 'eventApis') &&
            <SolaceEventApis
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              setFetchError={setFetchError}
              navigate={navigateTo}
            />}

          {(isFetched && solCommand.resource === 'eventApiVersions') &&
            <SolaceEventApiVersions
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />}        

          {(isFetched && solCommand.resource === 'eventApiProducts') &&
            <SolaceEventApiProducts
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
            />}

          {(isFetched && solCommand.resource === 'eventApiProductVersions') &&
            <SolaceEventApiProductVersions
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
              setFetchError={setFetchError}
              homeUrl={baseConfig.url}
            />}                    
        </MainContainer>
      </div>
      <EPUrlContainer style={{}}>
        URL: <a href="#" data-url={baseConfig.url} onClick={openLink} target="_blank">{baseConfig.url}</a>
      </EPUrlContainer>
    </div>
    
);
}

export default App;
