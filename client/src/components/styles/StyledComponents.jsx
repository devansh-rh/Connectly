import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import {
  darkBg,
  darkBg2,
  accentPrimary,
  accentSecondary,
  accentGradient,
  hoverGradient,
} from "../../constants/color";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(124, 58, 237, 0.15);
    color: ${accentPrimary};
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  outline: none;
  padding: 0 3rem;
  border-radius: 1rem;
  background-color: ${darkBg2};
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${accentPrimary};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
  
  &::placeholder {
    color: rgba(226, 232, 240, 0.5);
  }
`;

const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: 2px solid transparent;
  outline: none;
  border-radius: 1rem;
  background-color: ${darkBg2};
  color: #e2e8f0;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${accentSecondary};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
  
  &::placeholder {
    color: rgba(226, 232, 240, 0.5);
  }
`;

const CurveButton = styled("button")`
  border-radius: 1rem;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background: ${accentGradient};
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  
  &:hover {
    background: ${hoverGradient};
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ModernCard = styled("div")`
  background-color: ${darkBg2};
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid rgba(124, 58, 237, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(124, 58, 237, 0.4);
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  }
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  backgroundColor: "rgba(124, 58, 237, 0.2)",
  animation: `${bounceAnimation} 1s infinite`,
}));

export {
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
  BouncingSkeleton,
  ModernCard,
};