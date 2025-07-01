import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

interface PaginationControlsProps {
  currentFrom: number;
  pageSize: number;
  totalResults: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageJump: (pageNumber: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentFrom,
  pageSize,
  totalResults,
  handleNextPage,
  handlePrevPage,
  handlePageJump,
}) => {
  // total number of pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // current page is zero-based offset plus 1
  const currentPage = Math.floor(currentFrom / pageSize) + 1;

  // local state for the user's inline page input
  const [inputPage, setInputPage] = useState<number>(currentPage);

  // Sync inputPage with currentPage whenever currentPage changes (e.g., after
  // clicking "Prev Page" or "Next Page").
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // update inputPage as the user types
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(Number(e.target.value));
  };

  // on "Go" button click, validate and jump
  const onClickGo = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      handlePageJump(inputPage);
    } else {
      if (inputPage < 1) setInputPage(1);
      else if (inputPage > totalPages) setInputPage(totalPages);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginY="1rem"
      gap={2}
      flexWrap="wrap"
    >
      {/* Prev Page Button */}
      <Button disabled={currentFrom === 0} onClick={handlePrevPage}>
        &lt;&lt; Prev Page
      </Button>

      {/* Inline editable Page X of Y */}
      <Typography variant="body1" component="span">
        Page
      </Typography>
      <TextField
        type="number"
        size="small"
        value={inputPage}
        onChange={onChangeInput}
        onKeyDown={(e) => {
          // Optional: jump on Enter key
          if (e.key === 'Enter') {
            onClickGo();
          }
        }}
        style={{ width: 70, textAlign: 'center' }}
      />
      <Typography variant="body1" component="span">
        of {totalPages} (Showing {currentFrom + 1} -{' '}
        {Math.min(currentFrom + pageSize, totalResults)} of {totalResults})
      </Typography>

      {/* Next Page Button */}
      <Button
        disabled={currentFrom + pageSize >= totalResults}
        onClick={handleNextPage}
      >
        Next Page &gt;&gt;
      </Button>

      {/* "Go" button */}
      <Button variant="outlined" onClick={onClickGo}>
        Go
      </Button>
    </Box>
  );
};

export default PaginationControls;
