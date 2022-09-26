import { CircularProgress } from "@mui/material";
import Image from "next/image";
import styled from "styled-components";
import whatapp from "../assets/whatapplogi.png";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const StyledImageWrapper = styled.div`
  margin-bottom: 10px;
`;

const Loading = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image src={whatapp} alt="logo" height="200px" width="200px" />
      </StyledImageWrapper>
      <CircularProgress />
    </StyledContainer>
  );
};

export default Loading;
