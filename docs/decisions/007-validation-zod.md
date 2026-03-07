# ADR-007: Validation - Zod

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase follows the SDD methodology and needs to validate the constraints defined in spec data models (field types, required/optional, length limits, etc.) at runtime. Since TypeScript's static type system only operates at compile time, a separate library is needed for runtime data validation of API requests, form inputs, external data, and similar sources.

The choice of validation library impacts type safety, alignment with SDD specs, and framework integration.

## Options Considered

### 1. **Zod**
- Pros: TypeScript-first design with excellent type inference, React Hook Form / Server Actions integration, automatic type extraction from schemas (`z.infer<>`), concise API, error message customization
- Cons: Additional dependency, runtime overhead (negligible)

### 2. **Yup**
- Pros: Long-established and stable library, good integration with Formik
- Cons: Weaker TypeScript type inference than Zod, more verbose API, Formik-dependent ecosystem

### 3. **Joi**
- Pros: Very rich validation rules, strong server-side validation
- Cons: Large browser bundle size, no TypeScript type inference support, Node.js-centric

### 4. **io-ts**
- Pros: fp-ts based, works well with functional programming, powerful type system
- Cons: Steep learning curve, fp-ts dependency, small community

### 5. **AJV (JSON Schema)**
- Pros: JSON Schema standard-based, very fast validation performance
- Cons: Verbose JSON Schema syntax, limited TypeScript type inference, poor DX

## Decision
**Zod** is selected as the runtime validation library.

## Rationale

1. **TypeScript-first type inference**: TypeScript types can be automatically extracted from Zod schemas using `z.infer<typeof schema>`. Defining a schema once eliminates the need to write separate type definitions, maintaining the DRY principle.

2. **Natural connection with SDD specs**: Data model constraints defined in SDD specs can be mapped 1:1 to Zod schemas. When the spec defines a Zod schema, that schema serves as a bridge between the spec and runtime.

   ```
   Spec (document) → Zod Schema (code) → TypeScript Type (type) → Runtime Validation (validation)
   ```

3. **Server Actions integration**: Zod can be used in Next.js Server Actions to implement concise server-side input validation.

4. **React Hook Form integration**: Client-side form validation can be connected with Zod schemas through `@hookform/resolvers/zod`. The same schema is reused on both server and client.

5. **Error message customization**: Custom error messages, including localized messages, can be easily defined.

6. **Concise API**: Declarative and chainable API makes even complex validation rules easy to read and write.

## Consequences

### Positive
- A single schema solves both type definitions and runtime validation (DRY)
- Consistent pipeline from SDD spec to Zod schema to runtime validation
- Same schema reused for Server Actions and form validation
- TypeScript type inference reduces compile-time errors
- Concise and readable validation code

### Negative
- Additional runtime dependency (bundle size approximately 13KB gzipped)
- Zod schemas can become complex for complex validation logic
- Learning cost for the Zod API (but intuitive for TypeScript developers)
- Zod schemas must be updated alongside spec changes
