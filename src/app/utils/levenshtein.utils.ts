/**
 * - A direct implementation of Levenshtein distance algorithm.
 * - @see {https://medium.com/angular-in-depth/angular-smart-404-page-85a45b109fd8} for more details
 * @export
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export default function levenshtein(a: string, b: string): number {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const matrix = [];

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
