import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <Button className="z-[100]"
  
        variant="contained"
        onClick={scrollToTop}
        

        sx={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          backgroundColor: "#8E44AD",
          "&:hover": { backgroundColor: "#6C1B9B"

           },
        }}
      >
        Back to Top
      </Button>
    )
  );
};

export default BackToTopButton;
