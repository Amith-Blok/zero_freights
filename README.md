# Bloksupplychain Calculation Logic

## SEA FCL MODE
### Ocean Freight
- **HAPAG Data**

### Trucking Cost India
```plaintext
distance (km)
times = 1 (CFS only, applicable if origin country is India) or 2 (Factory)

totalDistance = times * distance
desielCost = (totalDistance / 2.5) * 100
tollCost = 1000
driverCost = (totalDistance / 300) * tollCost
emiCost = 3500
overWeightCost = if ton is equal to or higher than 19.5, then (30 * totalDistance), maximum 12000, else 0

sum = desielCost + tollCost + driverCost + emiCost + overWeightCost
profit = sum * 0.12
grandTotal = sum + profit
```

### Trucking Cost US/EU/CA
```plaintext
distance (miles)
totalDistance = 2 * distance
truckingCost = totalDistance * 3
profit = 250
grandTotal = truckingCost + profit, at least 600
```

### Railway Cost India
- **ONE LINE INHAULAGE CSV**

## SEA LCL MODE
### Sea LCL Freight Cost
- **CSV File**

### Trucking LTL India Cost
```plaintext
truckingCost (refer to the trucking calculation above)
oneUnit = truckingCost / 4 (min = 11000)
if cbm <= 15:
  truckingLTL = oneUnit
elif cbm <= 30:
  truckingLTL = oneUnit * 2
elif cbm <= 45:
  truckingLTL = oneUnit * 3
else:
  truckingLTL = oneUnit * 4
```

### Trucking LTL US Cost (Forward Air Logic)
```plaintext
basicDeliveryCharge (based on fa_station and zone)
profit = 0.335 + 250
if no airport:
  truckingLTL = basicDeliveryCharge * 0.335 + 250
else:
  truckingLTL = (basicDeliveryCharge + pickupCharge + originToDestinationCharge) * 0.335 + 250
```

### Terminal Charge
```plaintext
terminalChargeLogicOne = 1250 * cbm (min cbm = 2)
terminalChargeLogicTwo = 1750 * ton (min ton = 2)
terminalCharge = select the highest value between terminalChargeLogicOne and terminalChargeLogicTwo
```

### Doc Charge
- **4250 ₹**

### Loading and Unloading Fee
```plaintext
lbsPerHundred = (ton * 2204.62) / 100
loadingUnloadingFee = lbsPerHundred * 5.02 (min = 97)
```

### VGM Charge
```plaintext
vgm = 20 * cbm
```

### DDC Charge
```plaintext
ddc = 28.1 * cbm (min = 50)
```

### Chassis Fee
```plaintext
chassisLogicOne = 5 * cbm
chassisLogicTwo = 5 * ton
chassis = select the greatest value between chassisLogicOne and chassisLogicTwo
```

## AIR MODE
### Air Freight
- **DATABASE**

### Trucking LTL India Cost
- **Refer above**

### Trucking LTL US Cost (Forward Air Logic)
- **Refer above**

### Terminal Cost
- **350$**

### AMS Cost
- **20$**

### AWB
- **15$**

## LAND SEAPORT MODE
### Trucking India
- **Refer to SEA FCL Trucking Cost India**

### Trucking US
- **Refer to SEA FCL Trucking Cost US**

## LAND DOMESTIC MODE
### Trucking India
- **Refer to SEA LCL Trucking Cost India**

### Trucking US
- **Refer to SEA LCL Trucking Cost US**

## LAND AIRPORT MODE
### Trucking India
- **Refer to SEA LCL Trucking Cost India**

### Trucking US
- **Refer to SEA LCL Trucking Cost US**

## WAREHOUSE FCL MODE
### Trucking India
- **Refer to SEA FCL Trucking Cost India**

### Trucking US
- **Refer to SEA FCL Trucking Cost US**

### Pallet In Cost
```plaintext
totalPallet (total number of pallets)
if cbm <= 1.2:
  palletInCost = 12.5 * totalPallet
else:
  palletInCost = 15 * totalPallet
```

### Pallet Out Cost
- **Same as above**

### Storage Cost
```plaintext
if not dg:
  storageCost = 1.5 * cbm * storageDay
else:
  storageCost = 4.5 * cbm * storageDay
```

## WAREHOUSE LCL MODE and LTL MODE
### Trucking India
- **Refer to SEA LTL Trucking Cost India**

### Trucking US
- **Refer to SEA LTL Trucking Cost US**

### Pallet In Cost
```plaintext
totalPallet (total number of pallets)
if cbm <= 1.2:
  palletInCost = 12.5 * totalPallet
else:
  palletInCost = 15 * totalPallet
```

### Pallet Out Cost
- **Same as above**

### Storage Cost
```plaintext
if not dg:
  storageCost = 1.5 * cbm * storageDay
else:
  storageCost = 4.5 * cbm * storageDay
```

## WAREHOUSE LCL MODE and LTL MODE
### Trucking India
- **Refer to SEA LTL Trucking Cost India**

### Trucking US
- **Refer to SEA LTL Trucking Cost US**

### Pallet In Cost
```plaintext
totalPallet (total number of pallets)
if cbm <= 1.2:
  palletInCost = 12.5 * totalPallet
else:
  palletInCost = 15 * totalPallet
```

### Pallet Out Cost
- **Same as above**

### Storage Cost
```plaintext
if not dg:
  storageCost = 1.5 * cbm * storageDay
else:
  storageCost = 4.5 * cbm * storageDay
```
## US Custom Fees
- **Delivery Fee**: $85
- **ISF**: $35
- **Customs Fee**: $125
- **Document Charge Fee**: ₹5100
- **Security Manifest Document Fee**: ₹3750
