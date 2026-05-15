# OOP Design Notes

Core OOP points to present:

## Abstraction

`Workspace` is an abstract class. It exposes the shared contract:

```java
public abstract BigDecimal calculatePrice(int hours);
```

## Inheritance

`HotDesk`, `MeetingRoom`, and `PrivateOffice` extend `Workspace`.

`Member` and `Admin` extend `User`.

## Polymorphism

The booking flow can call:

```java
workspace.calculatePrice(hours);
```

The actual price rule changes depending on the runtime workspace type.

## Encapsulation

Entities keep state private and expose behavior through methods such as:

```java
wallet.recharge(amount);
wallet.pay(amount);
booking.calculateTotal();
```

## Composition

`Booking` contains a `Member` and a `Workspace`.

`Member` owns a `Wallet`.

`Wallet` has many `WalletTransaction` records.
