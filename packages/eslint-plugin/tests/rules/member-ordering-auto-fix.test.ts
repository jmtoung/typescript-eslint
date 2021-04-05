import rule, { MessageIds, Options } from '../../src/rules/member-ordering';
import { RuleTester } from '../RuleTester';
import { TSESLint } from '@typescript-eslint/experimental-utils';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    comment: true,
  },
});

const grouped1: TSESLint.RunTests<MessageIds, Options> = {
  valid: [],
  invalid: [
    /*
    Simple case of moving leading line comments
     */
    {
      code: `
type Foo = {
  // Comment for c
  // Comment 2
  c: string;
  b: string;
  a: string;
}
           `,
      output: `
type Foo = {
  a: string;
  b: string;
  // Comment for c
  // Comment 2
  c: string;
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of moving block comments
    */
    {
      code: `
type Foo = {
  /**
   * Pass a string CSS class name to apply to the root element. Whenever possible, apply
   * styling via the \`overrideRootStyles\` prop; this hook should only be used for the class
   * names provided by components like \`PrimaryColorOverride\` or \`PrimaryColorHoverState\`.
   */
  c: string;
  b: string;
  a: string;
}
           `,
      output: `
type Foo = {
  a: string;
  b: string;
  /**
   * Pass a string CSS class name to apply to the root element. Whenever possible, apply
   * styling via the \`overrideRootStyles\` prop; this hook should only be used for the class
   * names provided by components like \`PrimaryColorOverride\` or \`PrimaryColorHoverState\`.
   */
  c: string;
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of moving trailing comments (along with their whitespace)
     */
    {
      code: `
type Foo = {
  // Comment for c
  // Comment 2
  c: string;  // Trailing comment for c
  b: string;
  a: string; // Trailing comment for a
}
           `,
      output: `
type Foo = {
  a: string; // Trailing comment for a
  b: string;
  // Comment for c
  // Comment 2
  c: string;  // Trailing comment for c
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of sorting in-line literal, ensuring last property retains
    absence of comma punctuator.
     */
    {
      code: `
function myFunction({ x, y, z }: { z: string, y: string, x: string }) {
  return x + y + z
}
`,
      output: `
function myFunction({ x, y, z }: { x: string, y: string, z: string }) {
  return x + y + z
}
`,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of sorting in-line literal, ensuring last property retains
    absence of semi-colon punctuator.
     */
    {
      code: `
function myFunction({ a, b, c }: { c: string; b: string; a: string }) {
  return a + b + c
}
`,
      output: `
function myFunction({ a, b, c }: { a: string; b: string; c: string }) {
  return a + b + c
}
`,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of sorting in-line literal, ensuring last property retains
    presence of comma punctuator.
     */
    {
      code: `
function myFunction({ a, b, c }: { c: string; b: string; a: string, }) {
  return a + b + c
}
`,
      output: `
function myFunction({ a, b, c }: { a: string, b: string; c: string; }) {
  return a + b + c
}
`,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Simple case of sorting non-inline type literal, ensuring punctuators
    are left off
     */
    {
      code: `
type Props = {
  c: string
  b: string
  a: string
}
`,
      output: `
type Props = {
  a: string
  b: string
  c: string
}
`,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    {
      code: `
type EarningsChartProps = {
  earnings: string;
  width: number; // hi
  height: number;
}
`,
      output: `
type EarningsChartProps = {
  earnings: string;
  height: number;
  width: number; // hi
}
`,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Making sure internal block comment works
     */
    {
      code: `
type Foo = {
  a: string;
  c: string;

  /*
  I am a block comment
   */
  b: string;
}
           `,
      output: `
type Foo = {
  a: string;
  /*
  I am a block comment
   */
  b: string;

  c: string;
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Making sure internal line comment on its own line works
     */
    {
      code: `
type Foo = {
  a: string;
  c: string;
  // Comment for b
  b: string;
}
           `,
      output: `
type Foo = {
  a: string;
  // Comment for b
  b: string;
  c: string;
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
    /*
    Making sure internal trailing line comment works
     */
    {
      code: `
type Foo = {
  a: string;
  c: string; // Comment for c
  b: string;
}
           `,
      output: `
type Foo = {
  a: string;
  b: string;
  c: string; // Comment for c
}
           `,
      options: [
        { typeLiterals: { memberTypes: 'never', order: 'alphabetically' } },
      ],
      errors: [
        {
          messageId: 'incorrectOrderAlphabetical',
        },
      ],
    },
  ],
};

ruleTester.run('member-ordering', rule, {
  valid: [],
  invalid: [...grouped1.invalid],
});
