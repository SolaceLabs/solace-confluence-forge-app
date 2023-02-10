import styled from 'styled-components';
import { colors, elevation } from '@atlaskit/theme';

export const Card = styled.div`
  ${elevation['e100']};
  background: ${colors.N0};
  position: relative;
  text-decoration: none;
  border-radius: 3px;
  margin: 4px 1px;
  height: calc(100vh - 10px);
  box-sizing: border-box;
`;

export const Status = styled.span`
  float: right;
  align-items: center;
  display: inline-flex;
  margin-top: -24px;

  & > span {
    margin-left: 8px;
  }
`;

export const MainContainer = styled.div`
  min-height: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FormContainer = styled.form`
  padding: 8px 0;
`;

export const LoadingContainer = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 100%;
  background-color: black;
  color: white;
`;
export const BannerDisplayContainer = styled.div`
  width: auto;
  border: 1px solid #ddd;
  background-color: white;
  min-height: 120px;
  padding: 5px;
  word-break: break-all;
`;

export const LogoContainer = styled.div`
  display: 'flex';
  height: 36px;
  alignItems: 'center';
  justifyContent: 'center';
`;

export const IconContainer = styled.span`
  position: relative;
  height: 20px;
  width: 24px;
  align-self: center;
  display: inline-flex;
  flex-wrap: nowrap;
  max-width: 100%;
  position: relative;
`;

export const Icon = styled.span`
  position: absolute;
`;

export const ScrollContainer = styled.div`
  overflow: auto;
  max-height: calc(100% - 40px);
`;

export const SummaryFooter = styled.div`
  width: 100%;
  height: 40px;
  left: 0;
  background: ${colors.N10};
  border-top: 1px solid ${colors.N30};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SummaryCount = styled.div`
  padding: 0 12px;
`;

export const SummaryActions = styled.div`
  padding: 8px;
`;
