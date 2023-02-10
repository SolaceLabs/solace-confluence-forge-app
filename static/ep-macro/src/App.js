import React, { useEffect, useState, Fragment } from 'react';
import { invoke } from '@forge/bridge';
import { router } from '@forge/bridge';

// Atlaskit
import Spinner from '@atlaskit/spinner';
import Image from '@atlaskit/image';
// Custom Styles
import {
  Card, LoadingContainer, BannerContainer, MainContainer, MainPreloadContainer, EPUrlContainer
} from './Styles';

import SolaceLogo from './images/solace.png';
import Blanket from '@atlaskit/blanket';
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
    await getToken(user?.accountId);
    const config = await getConfig();
    const command = await parseUrl(config?.url, 5, page);
    setSolCommand(command);
    console.log('COMMAND', command);
  }

  const parseUrl = async(url, pageSize, pageNumber) => {
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
    const command = await parseUrl(url, 5, 1);
    setSolCommand(command);
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

  // if (isFetched && !solCommand) {
  //   return (
  //     <MainPreloadContainer>
  //       Missing or invalid Event Portal URL
  //     </MainPreloadContainer>
  //   );
  // }

  if (isFetched && solCommand && solCommand.error) {
    return (
      <MainPreloadContainer>
        {'Invalid URL: ' + solCommand.error}
      </MainPreloadContainer>
    );
  }

  const paginate = async (e, toPage) => {
    e.preventDefault();
    if (page === toPage)
      return;

    setIsBlanketVisible(true);
    const command = await parseUrl(config?.url, 5, toPage);
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
            />
          }

          {(isFetched && solCommand.resource === 'applicationversions') &&
            <SolaceApplicationVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
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
            />}

          {(isFetched && solCommand.resource === 'eventversions') &&
            <SolaceEventVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
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
            />}

          {(isFetched && solCommand.resource === 'schemaversions') &&
            <SolaceSchemaVersions 
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
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
              navigate={navigateTo}
            />}

          {(isFetched && solCommand.resource === 'enumversions') &&
            <SolaceEnumVersions
              command={solCommand}
              token={token}
              paginate={paginate}
              page={page}
              setIsBlanketVisible={setIsBlanketVisible}
              refresh={refresh}
              navigate={navigateTo}
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
