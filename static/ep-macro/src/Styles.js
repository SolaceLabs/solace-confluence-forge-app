import styled from 'styled-components';
import { colors, elevation } from '@atlaskit/theme';

export const Card = styled.div`
  ${elevation['e100']};
  background: ${colors.N0};
  position: relative;
  text-decoration: none;
  // border-radius: 3px;
  // margin: 4px 1px;
  // height: 100%;
  // box-sizing: border-box;
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

export const MainPreloadContainer = styled.div`
  // height: 440px;
  width: 98%;
  display: flex;
  flex-direction: column;
`;

export const MainContainer = styled.div`
  min-height: 440px;
  width: 98%;
  display: flex;
  flex-direction: column;
`;
export const ContentContainer = styled.div`
  min-height: 400px;
  width: 98%;
  padding: 5px;
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
  // height: 100%;
  // min-height: 440px;
  // max-height: 440px;
  overflow-y: hidden;
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
  min-height: 24px;
  padding: 5px;
  word-break: break-all;
`;
export const TitleContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #00cc91;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: bold
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
  max-width: 98%;
  position: relative;
`;

export const Icon = styled.span`
  position: absolute;
`;

export const ScrollContainer = styled.div`
  overflow: auto;
  max-height: 540px;
`;

export const SummaryFooter = styled.div`
  // width: 98%;
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

export const EPUrlContainer = styled.div`
  width: 95.5%;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  // margin-right: 10px;
  overflow-wrap: break-word;
  background: ${colors.N30};
  border-top: 1px solid ${colors.N30};
  font-size: 1em;
  font-weight: bold;
`;
