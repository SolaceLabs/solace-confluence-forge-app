import React, { useEffect, useState, Fragment } from 'react';
import { invoke } from '@forge/bridge';
import { router } from '@forge/bridge';

// Atlaskit
import Button from '@atlaskit/button/standard-button';   
import LoadingButton from '@atlaskit/button/loading-button';   
import TextArea from '@atlaskit/textarea';
import Lozenge from '@atlaskit/lozenge';
import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';
import { HelperMessage, Label } from '@atlaskit/form';
import Image from '@atlaskit/image';
import Modal from '@atlaskit/modal-dialog';
import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { SuccessProgressBar } from '@atlaskit/progress-bar';

import Form, { Field } from '@atlaskit/form';

// Custom Styles
import {
  Card, SummaryActions, SummaryCount, SummaryFooter, 
  LoadingContainer, BannerContainer, BannerDisplayContainer, MainContainer,
  FormContainer
} from './Styles';

import SolaceLogo from './images/solace.png';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserAccountId, setCurrentUserAccountId] = useState(null);
  const [currentUserToken, setCurrentUserToken] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  
  const [isTokenEditorDialogOpen, setIsTokenEditorDialogOpen] = useState(false);
  const [isTokenSubmitting, setIsTokenSubmitting] = useState(false);

  const [isTokenDeleteDialogOpen, setIsTokenDeleteDialogOpen] = useState(false);
  const [isTokenDeleting, setIsTokenDeleting] = useState(false);

  const openTokenDeleteDialog = () => {
    setIsTokenDeleteDialogOpen(true);
    setIsTokenDeleting(false);
  }

  const closeTokenDeleteDialog = () => {
    setIsTokenDeleteDialogOpen(false);
    setIsTokenDeleting(false);
  }

  const openTokenEditorDialog = () => {
    setIsTokenEditorDialogOpen(true);
    setIsTokenSubmitting(false);
  }

  const closeTokenEditorDialog = () => {
    setIsTokenEditorDialogOpen(false);
    setIsTokenSubmitting(false);
  }

  const updateToken = async () => {
    openTokenEditorDialog();
  }

  const deleteToken = async () => {
    openTokenDeleteDialog();
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      console.log('Get User');
      return await invoke('get-user')
        .then(user => {
          console.log('Current User', user);
          setCurrentUser(user);
          setCurrentUserAccountId(user.accountId);
          return user;
        })
        .catch(err => {
          console.log('Get current user failed');
          return null;
        })
    };

    const getCurrentToken = async () => {
      return await invoke('get-token')
        .then(token => {
          console.log('Current Token', token);
          setCurrentUserToken(token);
          setIsFetched(true);
        })
        .catch(err => {
          console.log('Get EP Token failed');
          setIsFetched(true);
        })
    }

    const currUser = getCurrentUser();
    if (currUser) {
      getCurrentToken();
    }
  }, []);

  if (!isFetched) {
    return (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    );
  }

  const Delete = () => currentUserToken ? (
      <LoadingButton
        appearance="danger"
        onClick={deleteToken}
      >      
        Delete
      </LoadingButton>
    ) : (<div/>);

  const RegisterOrUpdate = () => !currentUserToken ? (
    <Button
      appearance="primary"
      type="submit" 
      onClick={updateToken}
    >
      Register
    </Button>
  ) : ( 
    <Button
      appearance="warning"
      type="submit" 
      // spacing="compact"
      onClick={updateToken}
    >
      Update
    </Button>
  );

  const LastUpdatedLozenge = () => <Lozenge maxWidth={250}>Last updated: {currentUserToken ? new Date(currentUserToken.lastModifiedDate).toLocaleString() : ''}</Lozenge>;

  const openDocs = () => {
    router.open("https://docs.solace.com/Cloud/ght_api_tokens.htm");
  };

  const submitToken = async (token) => {
    setIsTokenSubmitting(true);

    const epToken = {
      epToken: token.token,
    };
    
    const payload = {
      token: epToken,
      accountId: currentUserAccountId
    };

    let newToken = null;
    if (currentUserToken && currentUserToken.id) {
      newToken = await invoke('update-token', payload);
      console.log('NEW TOKEN', newToken);
    } else {
      newToken = await invoke('register-token', payload);
      console.log('NEW TOKEN', newToken);
    }
    setIsTokenSubmitting(false)
    setCurrentUserToken(newToken);
    setIsTokenEditorDialogOpen(false);
  };

  const submitTokenDelete = async () => {
    setIsTokenDeleting(true);

    await invoke('delete-token');
    setIsTokenDeleting(false);
    setCurrentUserToken(null);
    setIsTokenDeleteDialogOpen(false);
  }

  return (
    <MainContainer style={{display: 'flex', flexDirection: 'column'}}>
      <ModalTransition>
        {isTokenEditorDialogOpen && (
          <ModalDialog onClose={closeTokenEditorDialog}>
            <Form
              onSubmit={(value) => submitToken(value)}
            >

              {({ formProps }) => (
                <form id="form-with-id" {...formProps}>
                  <ModalBody>
                    <Field label="Solace REST API Token" name="token" isRequired
                          defaultValue={currentUserToken ? currentUserToken.value.epToken : ""}>
                      {({ fieldProps }) => (
                        <TextArea {...fieldProps} 
                          resize="auto"
                          rows={15}
                          isRequired={true}
                        />
                      )}
                    </Field>
                    {isTokenSubmitting && (
                      <div style={{marginTop: 20}}>
                        Submitting...
                        <SuccessProgressBar ariaLabel="Recording token" isIndeterminate />
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={closeTokenEditorDialog} appearance="subtle">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      form="form-with-id"
                      appearance="primary"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Form>
          </ModalDialog>
        )}
      </ModalTransition>

      <ModalTransition>
        {isTokenDeleteDialogOpen && (
          <Modal onClose={closeTokenEditorDialog}>
            <ModalHeader>
              <ModalTitle>Delete Solace Event Portal Token</ModalTitle>
            </ModalHeader>
            <ModalBody>
              Are you sure you want to delete the API Token? <br/><br/>
              <span style={{fontWeight: 'bold'}}>This action cannot be undone!</span>
              {isTokenDeleting && (
                <div style={{marginTop: 20}}>
                  Deleting...
                  <SuccessProgressBar ariaLabel="Deleting token" isIndeterminate />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={closeTokenDeleteDialog}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={submitTokenDelete} autoFocus>
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>

      <BannerContainer>
        <Image src={SolaceLogo} style={{height: 36}} alt="Solace Logo"/>
        <span style={{marginRight: 10, fontSize: 14, fontWeight: 'bold'}}>Solace REST API Token Manager</span>
      </BannerContainer>

      <SectionMessage appearance="success">
        <p>Welcome to Confluence App for Solace Event Portal</p>
        <p>Here you can manage Solace Event Portal REST API token to access Event Portal resources in Confluence. 
          To know more about REST API tokens for using Solace PubSub+ Cloud, refer to 
          <a href="#" onClick={openDocs}> documentation</a></p>
        <p></p>
      </SectionMessage>
{console.log('TOKKKEN', currentUserToken)}

      <FormContainer style={{padding: 10}}>
        <Fragment>
          <Label>Solace REST API Token</Label>
          <BannerDisplayContainer>
            {currentUserToken ? 
              <Label style={{display: 'flex', justifyContent: 'flex-start'}}>{currentUserToken.value.epToken}</Label> :
              <Label style={{display: 'flex', justifyContent: 'center'}}>Not yet set!</Label>}
          </BannerDisplayContainer>
          <HelperMessage>
            REST API token
          </HelperMessage>
        </Fragment>
      </FormContainer>

      <SummaryFooter>
        <SummaryCount>
          <LastUpdatedLozenge />
        </SummaryCount>
        <SummaryActions>
          <RegisterOrUpdate />
          &nbsp;&nbsp;
          <Delete />
        </SummaryActions>
      </SummaryFooter>      
    </MainContainer>
  );
}

export default App;
