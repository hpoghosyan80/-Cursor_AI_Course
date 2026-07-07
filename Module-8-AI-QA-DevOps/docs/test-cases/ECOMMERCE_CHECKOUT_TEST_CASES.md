# E-Commerce Checkout — Test Cases

**Feature:** E-Commerce Checkout Process  
**Module:** 8 — AI for QA & DevOps  
**Version:** 1.0  
**Generated with:** Cursor AI  
**Related spec:** [ecommerce-checkout.md](../feature-spec/ecommerce-checkout.md)  
**Test data:** [ecommerce-checkout-test-data.json](../../test-data/ecommerce-checkout-test-data.json)

---

## Legend

| Field | Description |
|-------|-------------|
| **ID** | Unique test case identifier |
| **Priority** | P1 (critical) · P2 (high) · P3 (medium) |
| **Auto** | Candidate for automation (Y/N) |

---

## 1. Add to Cart — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| CART-P-001 | Add single item to empty cart | Empty cart; product in stock | 1. `POST /api/cart/items` | `validCartItems.singleItem` | `201 Created`; cart contains 1 item; `quantity: 1`; `unit_price` matches catalog | P1 | Y |
| CART-P-002 | Add multiple different items | Empty cart | 1. Add item A 2. Add item B | `validCartItems.multipleItems` | Cart has 2 line items; subtotal = sum of (qty × price) | P1 | Y |
| CART-P-003 | Increment quantity for existing item | Item already in cart | 1. Add same `product_id` again with `quantity: 2` | `PROD-003`, qty 2 | Quantity updated to 3 (merged) or separate line per business rule; subtotal correct | P1 | Y |
| CART-P-004 | Add item at max allowed quantity | Product in stock (≥99) | 1. Add with `quantity: 99` | `validCartItems.maxQuantity` | `201 Created`; quantity = 99 | P2 | Y |
| CART-P-005 | Cart persists across sessions | Logged-in user | 1. Add item 2. Logout 3. Login 4. `GET /api/cart` | `validCartItems.singleItem` | Cart still contains added item | P1 | Y |
| CART-P-006 | GET cart returns correct totals | Items in cart | 1. `GET /api/cart` | Cart with 2+ items | Response includes `items`, `subtotal`, `item_count` | P1 | Y |
| CART-P-007 | Update item quantity via PATCH | Item in cart | 1. `PATCH /api/cart/items/:id` with `quantity: 5` | `PROD-003`, qty 5 | `200 OK`; quantity updated; subtotal recalculated | P2 | Y |
| CART-P-008 | Remove item from cart | Item in cart | 1. `DELETE /api/cart/items/:id` | Existing cart item ID | `200 OK`; item removed; subtotal updated | P2 | Y |
| CART-P-009 | Unit price snapshot at add time | Product price changes after add | 1. Add item 2. Change catalog price 3. GET cart | `PROD-001` | Cart retains original `unit_price` until checkout refresh | P2 | Y |
| CART-P-010 | Guest cart before login merge | Guest cart + login | 1. Add as guest 2. Login 3. GET cart | Guest item + user account | Guest cart merged with user cart; no duplicates | P2 | Y |

---

## 2. Add to Cart — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| CART-N-001 | Reject missing product_id | Empty cart | 1. POST without `product_id` | `invalidCartItems.missingProductId` | `422`; validation error on `product_id` | P1 | Y |
| CART-N-002 | Reject invalid product_id | Empty cart | 1. POST with non-existent product | `invalidCartItems.invalidProductId` | `404 Not Found`; product does not exist | P1 | Y |
| CART-N-003 | Reject zero quantity | Empty cart | 1. POST with `quantity: 0` | `invalidCartItems.zeroQuantity` | `422`; quantity must be ≥ 1 | P1 | Y |
| CART-N-004 | Reject negative quantity | Empty cart | 1. POST with `quantity: -1` | `invalidCartItems.negativeQuantity` | `422`; validation error | P1 | Y |
| CART-N-005 | Reject quantity above maximum | Empty cart | 1. POST with `quantity: 100` | `invalidCartItems.exceedsMaxQuantity` | `422`; max quantity 99 | P2 | Y |
| CART-N-006 | Reject out-of-stock product | Product stock = 0 | 1. POST add to cart | `invalidCartItems.outOfStockProduct` | `409 Conflict`; insufficient stock message | P1 | Y |
| CART-N-007 | Reject non-numeric quantity | Empty cart | 1. POST with string quantity | `invalidCartItems.nonNumericQuantity` | `422`; type validation error | P2 | Y |
| CART-N-008 | Reject PATCH on non-existent cart item | Valid cart | 1. PATCH invalid item ID | `item_id: "fake-id"` | `404 Not Found` | P2 | Y |
| CART-N-009 | Reject unauthenticated cart access (if required) | Auth required | 1. GET /api/cart without token | No auth header | `401 Unauthorized` | P2 | Y |
| CART-N-010 | Reject exceeding cart product limit | 50 products in cart | 1. Add 51st distinct product | New product ID | `400`; max 50 distinct products | P3 | Y |

---

## 3. Add to Cart — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| CART-E-001 | Add item with $0.01 price | Product exists at $0.01 | 1. Add single-cent item | `edgeCases.singleCentItem` | `201 Created`; subtotal = $0.01 | P3 | Y |
| CART-E-002 | Add last available stock unit | stock = 1 | 1. Add qty 1 2. Second user adds same product | `lowStock` product | First succeeds; second gets `409` | P1 | Y |
| CART-E-003 | Concurrent add to same cart | Two parallel requests | 1. Simultaneous POST same item | Same product, qty 1 each | Final quantity correct; no oversell | P2 | Y |
| CART-E-004 | Empty cart after removing all items | Items in cart | 1. DELETE all items 2. GET cart | All item IDs | Cart empty; `items: []`, `subtotal: 0` | P2 | Y |
| CART-E-005 | Cart with 50 distinct products (boundary) | 49 products in cart | 1. Add 50th product | Valid product | `201 Created`; 50th item accepted | P3 | Y |
| CART-E-006 | Unicode product name display | Product with Unicode name | 1. Add to cart 2. GET cart | Product with non-Latin name | Name displayed correctly in cart JSON | P3 | Y |

---

## 4. Add to Cart — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| CART-S-001 | SQL injection in product_id | Empty cart | 1. POST with SQL payload | `securityPayloads.sqlInjectionProductId` | `404` or `422`; no SQL execution | P1 | Y |
| CART-S-002 | IDOR — modify another user's cart | User A and B carts | 1. User A PATCHes User B's cart item | User B item ID + User A token | `403 Forbidden` or `404` | P1 | Y |
| CART-S-003 | Price manipulation via request body | Empty cart | 1. POST with custom `unit_price: 0.01` | Valid product + tampered price | Server ignores client price; uses catalog price | P1 | Y |
| CART-S-004 | Mass assignment of cart totals | Valid cart | 1. PATCH cart with `subtotal: 0` | `{"subtotal": 0}` | Field ignored; server-calculated subtotal unchanged | P2 | Y |

---

## 5. Discount Codes — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DISC-P-001 | Apply valid percentage discount | Cart subtotal ≥ min_order | 1. `POST /api/cart/discount` | `discountCodes.validPercentage` (`SAVE10`) | `200 OK`; `discount` = 10% of subtotal; `total` reduced | P1 | Y |
| DISC-P-002 | Apply valid fixed discount | Cart subtotal ≥ $100 | 1. POST discount code | `discountCodes.validFixed` (`FLAT25`) | `200 OK`; $25 deducted from subtotal | P1 | Y |
| DISC-P-003 | Apply free shipping code | Any non-empty cart | 1. POST discount | `discountCodes.freeShipping` | `shipping: 0`; `free_shipping: true` | P2 | Y |
| DISC-P-004 | Case-insensitive code matching | Valid code `SAVE10` | 1. POST with `save10` | Lowercase variant | `200 OK`; discount applied | P2 | Y |
| DISC-P-005 | Remove applied discount | Discount applied | 1. `DELETE /api/cart/discount` | Active discount | `200 OK`; discount removed; totals restored | P2 | Y |
| DISC-P-006 | Discount reflected in checkout total | Discount + items | 1. Apply code 2. GET cart | `SAVE10` on $200 cart | `subtotal: 200`, `discount: 20`, totals correct | P1 | Y |
| DISC-P-007 | Replace discount code | One code applied | 1. Apply code A 2. Apply code B | Two valid codes | Code B replaces A; only one active | P2 | Y |

---

## 6. Discount Codes — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DISC-N-001 | Reject empty discount code | Cart with items | 1. POST empty code | `invalidDiscountCodes.empty` | `422`; code required | P1 | Y |
| DISC-N-002 | Reject non-existent code | Cart with items | 1. POST invalid code | `invalidDiscountCodes.nonExistent` | `400`; invalid or expired code message | P1 | Y |
| DISC-N-003 | Reject expired discount code | Cart with items | 1. POST expired code | `discountCodes.expired` | `400`; code expired | P1 | Y |
| DISC-N-004 | Reject below minimum order | Cart subtotal < min_order | 1. POST high-minimum code | `discountCodes.belowMinOrder` on $50 cart | `400`; minimum order not met | P1 | Y |
| DISC-N-005 | Reject max uses exceeded | Code at usage limit | 1. POST exhausted code | `discountCodes.maxUsesReached` | `400`; code no longer valid | P2 | Y |
| DISC-N-006 | Reject discount on empty cart | Empty cart | 1. POST valid code | `SAVE10` | `400`; cart is empty | P1 | Y |
| DISC-N-007 | Reject code with special characters | Cart with items | 1. POST malformed code | `invalidDiscountCodes.specialChars` | `422`; invalid code format | P2 | Y |
| DISC-N-008 | Reject second discount (no stacking) | One code applied | 1. Apply second code without removing first | Two valid codes | `400`; only one code allowed | P2 | Y |
| DISC-N-009 | Reject single-use code twice | Code used by same user | 1. Complete order with code 2. Re-apply same code | `single_use_per_user` code | `400`; already used | P2 | Y |

---

## 7. Discount Codes — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DISC-E-001 | Discount equals subtotal (100% off edge) | 50% code on small cart | 1. Apply 50% to $0.02 cart | Max discount scenario | Discount ≤ subtotal; total ≥ $0 | P3 | Y |
| DISC-E-002 | Fixed discount exceeds subtotal | $50 off on $30 cart | 1. Apply $50 fixed code | Subtotal $30 | Discount capped at $30; total = tax + shipping only | P2 | Y |
| DISC-E-003 | Apply code at exact min_order boundary | Subtotal exactly $50 | 1. Apply `SAVE10` (min $50) | Subtotal = $50.00 | `200 OK`; discount applied | P2 | Y |
| DISC-E-004 | Remove discount mid-checkout | Discount applied, checkout started | 1. DELETE discount during checkout | Active session | Totals recalculated; checkout must re-validate | P3 | Y |

---

## 8. Discount Codes — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DISC-S-001 | SQL injection in discount code | Cart with items | 1. POST SQL payload as code | `invalidDiscountCodes.sqlInjection` | `400` or `422`; no SQL execution | P1 | Y |
| DISC-S-002 | Brute force discount code guessing | Cart with items | 1. Submit 100+ invalid codes rapidly | Random codes | Rate limit `429` after threshold | P2 | Y |
| DISC-S-003 | Discount value tampering via API | Valid code applied | 1. PATCH cart with `discount: 9999` | Tampered discount field | Server ignores; recalculates from code rules | P1 | Y |

---

## 9. Payment Processing — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PAY-P-001 | Successful payment with valid Visa | Cart ready; checkout initiated | 1. `POST /api/checkout/payment` | `validPayment` | `200 OK`; `status: paid`; order created | P1 | Y |
| PAY-P-002 | Payment with Amex card | Cart ready | 1. POST payment | `edgeCases.amexCard` | `200 OK`; 4-digit CVV accepted | P2 | Y |
| PAY-P-003 | Payment includes correct order total | Cart $100 + tax + shipping | 1. Complete payment | Known cart totals | Charged amount matches `cart.total` | P1 | Y |
| PAY-P-004 | Payment with discount applied | Discount on cart | 1. Apply code 2. Pay | `SAVE10` + `validPayment` | Charged amount reflects discount | P1 | Y |
| PAY-P-005 | Only last 4 digits stored | Successful payment | 1. Pay 2. GET order | `validPayment` | Order shows `card_last4: 1111`; full number absent | P1 | Y |
| PAY-P-006 | Inventory decremented on payment | Stock = 5 | 1. Pay for qty 2 | Product with stock 5 | Stock becomes 3 | P1 | Y |
| PAY-P-007 | Idempotent payment (retry same idempotency key) | Checkout initiated | 1. POST payment twice with same key | Same idempotency header | Single charge; same order returned | P2 | Y |

---

## 10. Payment Processing — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PAY-N-001 | Reject invalid card number (Luhn fail) | Checkout ready | 1. POST payment | `invalidPayment.invalidCardNumber` | `422`; invalid card number | P1 | Y |
| PAY-N-002 | Reject expired card | Checkout ready | 1. POST payment | `invalidPayment.expiredCard` | `422`; card expired | P1 | Y |
| PAY-N-003 | Reject invalid CVV | Checkout ready | 1. POST payment | `invalidPayment.invalidCvv` | `422`; CVV must be 3–4 digits | P1 | Y |
| PAY-N-004 | Reject missing billing name | Checkout ready | 1. POST payment | `invalidPayment.missingBillingName` | `422`; billing name required | P1 | Y |
| PAY-N-005 | Reject invalid ZIP code | Checkout ready | 1. POST payment | `invalidPayment.invalidZip` | `422`; invalid billing ZIP | P2 | Y |
| PAY-N-006 | Reject declined card | Checkout ready | 1. POST payment | `invalidPayment.declinedCard` | `402 Payment Required`; payment failed | P1 | Y |
| PAY-N-007 | Reject payment on empty cart | Empty cart | 1. POST payment directly | `validPayment` | `400`; cart is empty | P1 | Y |
| PAY-N-008 | Reject payment without checkout | Cart with items, no checkout | 1. POST payment skipping checkout | `validPayment` | `400`; checkout not initiated | P2 | Y |
| PAY-N-009 | Reject payment with changed cart after checkout | Checkout then modify cart | 1. Checkout 2. Add item 3. Pay | Modified cart | `409`; cart changed, re-checkout required | P1 | Y |
| PAY-N-010 | Reject missing payment fields | Checkout ready | 1. POST `{}` | Empty body | `422`; multiple validation errors | P1 | Y |

---

## 11. Payment Processing — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PAY-E-001 | Payment on empty cart | Empty cart | 1. POST payment | `validPayment` | `400 Bad Request`; cannot pay empty cart | P1 | Y |
| PAY-E-002 | Payment at exact stock boundary | stock = 1, qty = 1 | 1. Pay for last unit | `lowStock` | Payment succeeds; stock = 0 | P1 | Y |
| PAY-E-003 | Unicode billing name | Checkout ready | 1. POST payment | `edgeCases.unicodeBillingName` | `200 OK`; name stored correctly | P3 | Y |
| PAY-E-004 | Rate limit on payment attempts | 10+ failures in 1 hour | 1. Submit 11 failed payments | Declined cards | 11th returns `429 Too Many Requests` | P2 | Y |
| PAY-E-005 | Payment timeout handling | Slow gateway | 1. POST payment during gateway timeout | Valid card | `504` or retry guidance; no duplicate charge | P2 | N |

---

## 12. Payment Processing — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PAY-S-001 | Full card number not in API response | Successful payment | 1. Pay 2. Inspect order JSON | `validPayment` | No full `card_number` in response | P1 | Y |
| PAY-S-002 | CVV never persisted | Successful payment | 1. Pay 2. Query order record | `validPayment` | CVV absent from DB and API | P1 | Y |
| PAY-S-003 | Card number not in server logs | Payment attempt | 1. Pay 2. Inspect logs | `securityPayloads.cardNumberInLogs` | Full PAN not logged | P1 | Y |
| PAY-S-004 | Luhn validation enforced | Checkout ready | 1. POST invalid Luhn number | `4111111111111112` | `422`; rejected before gateway | P1 | Y |
| PAY-S-005 | Oversized card number rejected | Checkout ready | 1. POST 34-digit number | `securityPayloads.oversizedCardNumber` | `422`; length validation | P1 | Y |
| PAY-S-006 | XSS in billing name sanitized | Checkout ready | 1. POST payment | `securityPayloads.xssBillingName` | Name sanitized; no script in response | P1 | Y |
| PAY-S-007 | SQL injection in payment fields | Checkout ready | 1. POST SQL in billing fields | SQL payloads | `422`; no SQL execution | P1 | Y |
| PAY-S-008 | HTTPS required for payment (production) | Production env | 1. POST payment over HTTP | Valid payment | Rejected or redirected to HTTPS | P2 | N |

---

## 13. Order Confirmation — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| ORD-P-001 | Order created after successful payment | Payment completed | 1. `GET /api/orders/:id` | Order ID from payment response | `200 OK`; `status: paid`; items, totals present | P1 | Y |
| ORD-P-002 | Order confirmation receipt | Paid order | 1. `GET /api/orders/:id/confirmation` | Valid order ID | Receipt with order ID, date, items, subtotal, tax, total | P1 | Y |
| ORD-P-003 | Order ID format | Payment completed | 1. Inspect order ID | New order | Matches `ORD-` + UUID pattern | P2 | Y |
| ORD-P-004 | Order lists all purchased items | Multi-item cart paid | 1. GET order | Order from multi-item cart | All line items with qty and price | P1 | Y |
| ORD-P-005 | Order shows applied discount | Discount used at checkout | 1. GET order | Order with `SAVE10` | `discount` field shows applied amount | P2 | Y |
| ORD-P-006 | Order shows shipping address | Payment with address | 1. GET order | Complete checkout | `shipping_address` populated | P2 | Y |
| ORD-P-007 | User can only view own orders | User A order | 1. User B GETs User A order | Cross-user order ID | `403 Forbidden` or `404` | P1 | Y |

---

## 14. Order Confirmation — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| ORD-N-001 | Reject GET non-existent order | None | 1. GET invalid order ID | `ORD-invalid` | `404 Not Found` | P1 | Y |
| ORD-N-002 | Reject unauthenticated order access | Paid order | 1. GET without token | No auth | `401 Unauthorized` | P1 | Y |
| ORD-N-003 | Reject confirmation for failed payment | Payment failed | 1. GET confirmation | Failed order ID | `404` or `402`; no confirmation for unpaid | P1 | Y |
| ORD-N-004 | Reject checkout without shipping address | Cart with items | 1. POST checkout without address | Missing `shipping_address` | `422`; address required | P1 | Y |
| ORD-N-005 | Reject checkout without accepting terms | Cart with items | 1. POST checkout | `checkout.termsNotAccepted` | `422`; terms must be accepted | P1 | Y |

---

## 15. Order Confirmation — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| ORD-E-001 | Order total precision (cents) | Items totaling fractional cents | 1. Complete order | $0.01 + tax items | Totals rounded to 2 decimal places; no float drift | P2 | Y |
| ORD-E-002 | Large order (50 line items) | Max cart size | 1. Pay 2. GET order | 50-item cart | All items listed; performance acceptable (<2s) | P3 | Y |
| ORD-E-003 | Duplicate order prevention | Payment in progress | 1. Double-submit checkout | Same cart, parallel requests | Single order created | P1 | Y |

---

## 16. Order Confirmation — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| ORD-S-001 | IDOR — access another user's order | Two users | 1. User B GETs User A order ID | Cross-user token | `403` or `404` | P1 | Y |
| ORD-S-002 | Order enumeration prevention | Attacker guesses IDs | 1. Sequential order ID guesses | `ORD-0001`, `ORD-0002` | Non-UUID IDs rejected; no data leak | P2 | Y |
| ORD-S-003 | PII minimization in order API | Paid order | 1. GET order | Valid order | Full card number absent; only last4 | P1 | Y |

---

## 17. Email Notifications — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| EMAIL-P-001 | Confirmation email sent on payment | Successful payment | 1. Complete payment 2. Check email queue | Paid order | Email queued within 60s; `confirmation_sent_at` set | P1 | Y |
| EMAIL-P-002 | Email contains order ID and total | Email dispatched | 1. Inspect email payload | `emailExpectations.confirmationContains` | Body includes `order_id`, `total`, item list | P1 | Y |
| EMAIL-P-003 | Email sent to customer address | Logged-in user with email | 1. Complete payment | User email on file | Recipient matches `customer_email` | P1 | Y |
| EMAIL-P-004 | Email shows masked card (last 4) | Card payment | 1. Inspect email | Paid order | Shows `****1111`; not full PAN | P1 | Y |
| EMAIL-P-005 | Resend confirmation email | Paid order | 1. `POST /api/orders/:id/resend-email` | Valid order ID | `200 OK`; new email queued | P2 | Y |
| EMAIL-P-006 | Email subject line correct | Email dispatched | 1. Inspect email metadata | Paid order | Subject contains "Order Confirmation" | P3 | Y |
| EMAIL-P-007 | Email lists all order items | Multi-item order | 1. Inspect email body | 3-item order | Each product name, qty, price listed | P2 | Y |

---

## 18. Email Notifications — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| EMAIL-N-001 | No email on failed payment | Payment declined | 1. Failed payment 2. Check queue | `declinedCard` | No confirmation email sent | P1 | Y |
| EMAIL-N-002 | Reject resend for non-existent order | None | 1. POST resend invalid ID | `ORD-fake` | `404 Not Found` | P2 | Y |
| EMAIL-N-003 | Reject resend by non-owner | User B order | 1. User A resend User B order email | Cross-user | `403 Forbidden` | P1 | Y |
| EMAIL-N-004 | No email when customer email missing | Guest without email | 1. Pay as guest without email | No email on file | `422` at checkout or email skipped with warning | P2 | Y |
| EMAIL-N-005 | Rate limit on resend email | Paid order | 1. Resend 5+ times rapidly | Same order ID | `429` after threshold | P3 | Y |

---

## 19. Email Notifications — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| EMAIL-E-001 | Email with Unicode customer name | Unicode billing name | 1. Pay 2. Check email | `edgeCases.unicodeBillingName` | Name rendered correctly in email | P3 | Y |
| EMAIL-E-002 | Email retry on transient failure | SMTP temporarily down | 1. Pay during outage 2. Retry job runs | Simulated failure | Email eventually delivered; max 3 retries | P2 | N |
| EMAIL-E-003 | Duplicate email prevention | Successful payment | 1. Pay once 2. Check queue count | Single order | Exactly one confirmation email | P2 | Y |

---

## 20. Email Notifications — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| EMAIL-S-001 | No full card number in email | Email sent | 1. Inspect email body | Paid order | PAN and CVV absent | P1 | Y |
| EMAIL-S-002 | Email header injection prevention | Checkout with crafted name | 1. Pay with `name: "User\r\nBcc: attacker@evil.com"` | CRLF injection | Email sent only to intended recipient | P1 | Y |
| EMAIL-S-003 | XSS in email template escaped | Product with HTML name | 1. Order product with `<script>` in name | XSS product name | HTML escaped in email body | P1 | Y |
| EMAIL-S-004 | Resend requires authentication | Paid order | 1. POST resend without token | No auth | `401 Unauthorized` | P1 | Y |

---

## Test Summary

| Category | Cart | Discount | Payment | Order | Email | **Total** |
|----------|------|----------|---------|-------|-------|-----------|
| Positive | 10 | 7 | 7 | 7 | 7 | **38** |
| Negative | 10 | 9 | 10 | 5 | 5 | **39** |
| Edge | 6 | 4 | 5 | 3 | 3 | **21** |
| Security | 4 | 3 | 8 | 3 | 4 | **22** |
| **Total** | **30** | **23** | **30** | **18** | **19** | **120** |

---

## Execution Notes

1. **Environment:** Run against checkout API (`/api/cart`, `/api/checkout`, `/api/orders`) with test catalog and mock payment gateway.
2. **Setup:** Seed product catalog from `ecommerce-checkout-test-data.json`; reset cart between test runs.
3. **Payment gateway:** Use test card numbers (`4111111111111111` = success, `4000000000000002` = decline).
4. **Email:** Use mail catcher (Mailhog/Mailtrap) or mock email queue for notification tests.
5. **Traceability:** Map automated tests to IDs (e.g. `test_CART_P_001_add_single_item`).

---

## AI Generation Prompt

> Generate comprehensive test cases for an e-commerce checkout process. Include test cases for adding items to cart, applying discount codes, payment processing, order confirmation, and email notifications. Cover positive scenarios, negative scenarios, edge cases (empty cart, invalid payment), and security scenarios (payment data validation, SQL injection prevention).
