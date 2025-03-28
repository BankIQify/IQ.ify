
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TwentyFourPuzzle {
  numbers: number[];
  solution: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('SUPABASE_ANON_KEY');
    const url = Deno.env.get('SUPABASE_URL');

    if (!apiKey || !url) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(url, apiKey);

    // Parse request body
    const { count = 10, difficulty = 'easy' } = await req.json();

    // Generate puzzles
    const puzzles = generateTwentyFourPuzzles(count, difficulty);

    // Insert puzzles into the database
    const insertResults = [];

    for (const puzzle of puzzles) {
      const { error, data } = await supabase
        .from('game_puzzles')
        .insert({
          game_type: 'twenty_four',
          difficulty,
          puzzle_data: puzzle,
        })
        .select('id');

      if (error) {
        throw error;
      }

      insertResults.push(data);
    }

    return new Response(
      JSON.stringify({
        success: true,
        puzzles,
        insertResults
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error generating 24 Game puzzles:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

function generateTwentyFourPuzzles(count: number, difficulty: string): TwentyFourPuzzle[] {
  const puzzles: TwentyFourPuzzle[] = [];
  const existingNumberSets = new Set<string>();
  
  // Define difficulty ranges
  const difficultyRanges = {
    easy: { min: 1, max: 10 },
    medium: { min: 1, max: 13 },
    hard: { min: 1, max: 20 }
  };
  
  const range = difficultyRanges[difficulty as keyof typeof difficultyRanges] || difficultyRanges.easy;
  
  let attempts = 0;
  const maxAttempts = count * 20; // Limit the number of attempts
  
  while (puzzles.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Generate 4 random numbers within the difficulty range
    const numbers = Array.from({ length: 4 }, () => 
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    );
    
    // Sort the numbers to check for duplicates
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const numberSetKey = sortedNumbers.join(',');
    
    // Skip if we've already generated this number set
    if (existingNumberSets.has(numberSetKey)) {
      continue;
    }
    
    // Try to find a solution
    const solution = findSolution(numbers);
    
    if (solution) {
      existingNumberSets.add(numberSetKey);
      puzzles.push({
        numbers,
        solution
      });
    }
  }
  
  return puzzles;
}

function findSolution(numbers: number[]): string | null {
  // This is a simplified solver. A real solver would need to be more sophisticated.
  const ops = ['+', '-', '*', '/'];
  const permutations = generatePermutations(numbers);
  
  for (const perm of permutations) {
    for (const op1 of ops) {
      for (const op2 of ops) {
        for (const op3 of ops) {
          // Try different groupings
          // ((a op1 b) op2 c) op3 d
          const expr1 = `((${perm[0]} ${op1} ${perm[1]}) ${op2} ${perm[2]}) ${op3} ${perm[3]}`;
          if (evaluateExpression(expr1) === 24) return expr1;
          
          // (a op1 b) op2 (c op3 d)
          const expr2 = `(${perm[0]} ${op1} ${perm[1]}) ${op2} (${perm[2]} ${op3} ${perm[3]})`;
          if (evaluateExpression(expr2) === 24) return expr2;
          
          // (a op1 (b op2 c)) op3 d
          const expr3 = `(${perm[0]} ${op1} (${perm[1]} ${op2} ${perm[2]})) ${op3} ${perm[3]}`;
          if (evaluateExpression(expr3) === 24) return expr3;
          
          // a op1 (b op2 (c op3 d))
          const expr4 = `${perm[0]} ${op1} (${perm[1]} ${op2} (${perm[2]} ${op3} ${perm[3]}))`;
          if (evaluateExpression(expr4) === 24) return expr4;
          
          // a op1 ((b op2 c) op3 d)
          const expr5 = `${perm[0]} ${op1} ((${perm[1]} ${op2} ${perm[2]}) ${op3} ${perm[3]})`;
          if (evaluateExpression(expr5) === 24) return expr5;
        }
      }
    }
  }
  
  return null;
}

function evaluateExpression(expr: string): number {
  try {
    // This is unsafe for production, but for a controlled environment it works
    // eslint-disable-next-line no-eval
    return eval(expr);
  } catch (e) {
    return NaN;
  }
}

function generatePermutations(arr: number[]): number[][] {
  if (arr.length <= 1) {
    return [arr];
  }
  
  const result: number[][] = [];
  
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const permutations = generatePermutations(remaining);
    
    for (const perm of permutations) {
      result.push([current, ...perm]);
    }
  }
  
  return result;
}
